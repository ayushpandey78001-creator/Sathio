"""
Rating score + match-scoring logic.

Rating score (0-100): rewards a complete, well-signposted profile — this is
what makes someone easy to discover and trust in the network.
  - up to 25 pts: bio quality (length, capped)
  - up to 35 pts: skills (7 pts each, up to 5 skills)
  - up to 15 pts: at least one "looking for" interest tagged
  - up to 15 pts: portfolio / GitHub / LinkedIn link present
  - up to 10 pts: college / affiliation present

Match score (0-100) between two users: weighted overlap of skills and
interests, using Jaccard similarity so it naturally rewards focused overlap
rather than just "who has the most skills".
"""

from typing import List, Tuple
from . import models


def compute_rating_score(user: models.User) -> int:
    score = 0

    bio_len = len(user.bio or "")
    score += min(25, round(bio_len / 6))  # ~150 chars for full marks

    num_skills = len(user.skill_links or [])
    score += min(35, num_skills * 7)

    interests = [i for i in (user.looking_for or "").split(",") if i]
    if interests:
        score += 15

    if user.portfolio_url:
        score += 15

    if user.college:
        score += 10

    return min(100, score)


def _skill_set(user: models.User) -> set:
    return {link.skill.name.lower() for link in (user.skill_links or [])}


def _interest_set(user: models.User) -> set:
    return {i.strip().lower() for i in (user.looking_for or "").split(",") if i.strip()}


def _jaccard(a: set, b: set) -> float:
    if not a and not b:
        return 0.0
    union = a | b
    if not union:
        return 0.0
    return len(a & b) / len(union)


def compute_match(user_a: models.User, user_b: models.User) -> Tuple[int, List[str], List[str]]:
    """Returns (match_score 0-100, shared_skills, shared_interests)."""
    skills_a, skills_b = _skill_set(user_a), _skill_set(user_b)
    interests_a, interests_b = _interest_set(user_a), _interest_set(user_b)

    skill_sim = _jaccard(skills_a, skills_b)
    interest_sim = _jaccard(interests_a, interests_b)

    # Skills matter more than stated interests for team-fit, but both count.
    raw_score = (skill_sim * 0.7 + interest_sim * 0.3) * 100

    # Small bonus for well-rounded (rated) profiles so ghost profiles rank lower.
    quality_bonus = compute_rating_score(user_b) * 0.1

    final_score = min(100, round(raw_score + quality_bonus))

    shared_skills = sorted(skills_a & skills_b)
    shared_interests = sorted(interests_a & interests_b)

    return final_score, shared_skills, shared_interests
