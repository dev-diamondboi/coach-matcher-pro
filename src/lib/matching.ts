import { CoachProfile, User } from "@prisma/client";

export type QuizInput = {
  goalTags: string[];       // e.g., ["Leadership","Communication"]
  languages: string[];      // client languages
  budgetMax?: number;       // client maximum willing to pay per hour
  timezone?: string;        // client tz (for overlap scoring)
};

function csvToArr(s?: string | null) { return (s || "").split(",").map(x=>x.trim()).filter(Boolean); }

export function scoreCoach(coach: (CoachProfile & { user: User }), quiz: QuizInput) {
  let score = 0;

  // Specialty overlap (weight 5 each)
  const specialtyMatches = quiz.goalTags.filter(tag => csvToArr(coach.specialties).includes(tag)).length;
  score += specialtyMatches * 5;

  // Language match (weight 3 each; at least one common language)
  const langOverlap = quiz.languages.filter(l => csvToArr(coach.languages).includes(l)).length;
  if (langOverlap > 0) score += 3;

  // Budget fit (weight up to 5)
  if (quiz.budgetMax != null) {
    if (coach.pricePerHour <= quiz.budgetMax) {
      const diff = Math.max(0, quiz.budgetMax - coach.pricePerHour);
      score += Math.min(5, Math.floor(diff / 25) + 2); // closer/under budget yields more
    } else {
      score -= 2; // over budget penalty
    }
  }

  // Rating (weight up to 5)
  const ratingBoost = Math.min(5, Math.floor(coach.rating));
  score += ratingBoost;

  // Timezone heuristic (weight 2 if same region prefix)
  if (quiz.timezone && coach.timezone && quiz.timezone.split("/")[0] === coach.timezone.split("/")[0]) {
    score += 2;
  }

  return score;
}

export function pickTop(coaches: Array<CoachProfile & { user: User }>, quiz: QuizInput, n = 3) {
  const scored = coaches.map(c => ({ coach: c, score: scoreCoach(c, quiz) }));
  // simple rotation: random small jitter to prevent over-concentration on ties
  scored.forEach(s => s.score += Math.random() * 0.5);
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0, n);
}
