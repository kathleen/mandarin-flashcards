import { Router } from 'express';
import db from './db';
import { requireAuth } from './auth';

type AnswerResult = 'correct' | 'correctWithHint' | 'incorrect';

interface SessionRow {
  id: number;
  card_order: string;
  current_index: number;
  correct: number;
  correct_with_hint: number;
  incorrect: number;
  incorrect_card_ids: string;
  status: string;
  started_at: string;
  updated_at: string;
}

export const createProgressRouter = (validIds: Set<number>) => {
  const router = Router();
  router.use(requireAuth);

  router.get('/', (req, res) => {
    const userId = req.user!.id;
    const active = db
      .prepare("SELECT * FROM sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1")
      .get(userId) as SessionRow | undefined;
    const cardStats = db
      .prepare(
        'SELECT card_id AS cardId, correct, correct_with_hint AS correctWithHint, incorrect, last_answered_at AS lastAnsweredAt FROM card_stats WHERE user_id = ?'
      )
      .all(userId);
    const recentSessions = db
      .prepare(
        "SELECT updated_at AS finishedAt, correct, correct_with_hint AS correctWithHint, incorrect, json_array_length(card_order) AS total FROM sessions WHERE user_id = ? AND status = 'finished' ORDER BY id DESC LIMIT 10"
      )
      .all(userId);
    res.json({
      activeSession: active
        ? {
            cardOrder: JSON.parse(active.card_order) as number[],
            currentIndex: active.current_index,
            correct: active.correct,
            correctWithHint: active.correct_with_hint,
            incorrect: active.incorrect,
            incorrectCardIds: JSON.parse(active.incorrect_card_ids) as number[]
          }
        : null,
      cardStats,
      recentSessions
    });
  });

  router.post('/session', (req, res) => {
    const order = req.body?.cardOrder;
    if (
      !Array.isArray(order) ||
      order.length === 0 ||
      !order.every((id) => typeof id === 'number' && validIds.has(id)) ||
      new Set(order).size !== order.length
    ) {
      return res.status(400).json({ error: 'Invalid card order' });
    }
    const userId = req.user!.id;
    db.transaction(() => {
      db.prepare("DELETE FROM sessions WHERE user_id = ? AND status = 'active'").run(userId);
      db.prepare('INSERT INTO sessions (user_id, card_order) VALUES (?, ?)').run(
        userId,
        JSON.stringify(order)
      );
    })();
    res.status(201).json({ ok: true });
  });

  router.post('/answer', (req, res) => {
    const { cardId, result } = req.body || {};
    if (typeof cardId !== 'number' || !validIds.has(cardId)) {
      return res.status(400).json({ error: 'Invalid cardId' });
    }
    if (result !== 'correct' && result !== 'correctWithHint' && result !== 'incorrect') {
      return res.status(400).json({ error: 'Invalid result' });
    }
    const r: AnswerResult = result;
    const userId = req.user!.id;
    const c = r === 'correct' ? 1 : 0;
    const h = r === 'correctWithHint' ? 1 : 0;
    const i = r === 'incorrect' ? 1 : 0;

    const apply = db.transaction((): boolean => {
      const session = db
        .prepare("SELECT * FROM sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1")
        .get(userId) as SessionRow | undefined;
      if (!session) return false;
      const order = JSON.parse(session.card_order) as number[];
      // Ignore answers that don't match the card currently being asked (e.g. duplicate/stale requests)
      if (order[session.current_index] !== cardId) return false;

      db.prepare(
        `INSERT INTO card_stats (user_id, card_id, correct, correct_with_hint, incorrect, last_answered_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id, card_id) DO UPDATE SET
           correct = correct + excluded.correct,
           correct_with_hint = correct_with_hint + excluded.correct_with_hint,
           incorrect = incorrect + excluded.incorrect,
           last_answered_at = excluded.last_answered_at`
      ).run(userId, cardId, c, h, i);

      const incorrectIds = JSON.parse(session.incorrect_card_ids) as number[];
      if (i) incorrectIds.push(cardId);
      const nextIndex = session.current_index + 1;
      db.prepare(
        `UPDATE sessions SET current_index = ?, correct = correct + ?, correct_with_hint = correct_with_hint + ?,
           incorrect = incorrect + ?, incorrect_card_ids = ?, status = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).run(
        nextIndex,
        c,
        h,
        i,
        JSON.stringify(incorrectIds),
        nextIndex >= order.length ? 'finished' : 'active',
        session.id
      );
      return true;
    });

    if (!apply()) {
      return res.status(409).json({ error: 'No matching active session' });
    }
    res.json({ ok: true });
  });

  return router;
};
