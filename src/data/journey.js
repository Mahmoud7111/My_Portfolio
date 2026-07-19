import { me } from './me.js';

const parseDate = (dateStr) => {
  const clean = dateStr.replace(/–/g, '-').trim();

  if (clean.includes('Present')) {
    return { year: 9999, month: 12 };
  }

  const monthMap = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,
    'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8,
    'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
    'Jan.': 1, 'Feb.': 2, 'Mar.': 3, 'Apr.': 4,
    'May.': 5, 'Jun.': 6, 'Jul.': 7, 'Aug.': 8,
    'Sep.': 9, 'Oct.': 10, 'Nov.': 11, 'Dec.': 12,
  };

  const monthMatch = clean.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (monthMatch) {
    const month = monthMap[monthMatch[1]] || 1;
    const year = parseInt(monthMatch[2]);
    return { year, month };
  }

  const yearMatch = clean.match(/^(\d{4})$/);
  if (yearMatch) {
    return { year: parseInt(yearMatch[1]), month: 12 };
  }

  const rangeMatch = clean.match(/^(\d{4})\s*[-–]\s*(\d{4})?$/);
  if (rangeMatch) {
    const year = parseInt(rangeMatch[1]);
    const endYear = rangeMatch[2] ? parseInt(rangeMatch[2]) : 9999;
    return { year: (year + endYear) / 2, month: 6 };
  }

  return { year: 0, month: 0 };
};

const buildEntry = (date, type, title, description, link = null) => ({
  date, type, title, description, link,
});

const ALL_JOURNEY = [
  ...me.experience.map((exp) => buildEntry(
    exp.period,
    'experience',
    exp.role,
    exp.bullets.join(' ')
  )),
  ...me.education.map((edu) => buildEntry(
    edu.year,
    'education',
    edu.degree,
    edu.institution
  )),
  buildEntry('2024', 'award', 'TOP 3 MSP Software Hackathon', 'MSP Tech Club'),
];

export const JOURNEY = ALL_JOURNEY.sort((a, b) => {
  const dateA = parseDate(a.date);
  const dateB = parseDate(b.date);
  if (dateB.year !== dateA.year) return dateB.year - dateA.year;
  return dateB.month - dateA.month;
});