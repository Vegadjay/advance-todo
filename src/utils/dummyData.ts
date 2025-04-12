
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderColor: FolderColor;
  isPinned: boolean;
  createdAt: Date;
  status: TaskStatus;
}

export type FolderColor = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'pink' | 'red';

export const FOLDER_COLORS: FolderColor[] = ['purple', 'blue', 'green', 'yellow', 'orange', 'pink', 'red'];

const createDummyNote = (
  id: string,
  title: string,
  content: string,
  folderColor: FolderColor,
  isPinned: boolean,
  daysAgo: number,
  status: TaskStatus
): Note => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    id,
    title,
    content,
    folderColor,
    isPinned,
    createdAt: date,
    status,
  };
};

export const dummyNotes: Note[] = [
  createDummyNote(
    '1',
    'Project Planning',
    'Create wireframes for the new dashboard interface and share with the design team.',
    'purple',
    true,
    0,
    'inProgress'
  ),
  createDummyNote(
    '2',
    'Shopping List',
    'Milk\nEggs\nBread\nFruit\nVegetables',
    'blue',
    false,
    0,
    'todo'
  ),
  createDummyNote(
    '3',
    'Book Recommendations',
    'Atomic Habits\nThe Psychology of Money\nThinking Fast and Slow',
    'green',
    true,
    1,
    'done'
  ),
  createDummyNote(
    '4',
    'React Conference Notes',
    'New Hooks API\nServer Components\nPerformance Optimizations',
    'yellow',
    false,
    1,
    'inProgress'
  ),
  createDummyNote(
    '5',
    'Workout Routine',
    'Monday: Chest & Triceps\nWednesday: Back & Biceps\nFriday: Legs & Shoulders',
    'orange',
    false,
    2,
    'todo'
  ),
  createDummyNote(
    '6',
    'Travel Plans',
    'Research flights to Barcelona\nBook accommodation\nPlan itinerary',
    'pink',
    true,
    2,
    'todo'
  ),
  createDummyNote(
    '7',
    'Birthday Gift Ideas',
    'Smart watch\nBooks\nCooking class\nVinyl records',
    'red',
    false,
    3,
    'done'
  ),
  createDummyNote(
    '8',
    'Home Improvements',
    'Paint living room\nFix kitchen cabinet\nReplace bathroom light fixture',
    'green',
    false,
    3,
    'inProgress'
  ),
  createDummyNote(
    '9',
    'Learning Goals',
    'Master TypeScript\nBuild a mobile app\nLearn about system design',
    'blue',
    true,
    4,
    'inProgress'
  ),
  createDummyNote(
    '10',
    'Recipe: Pasta Carbonara',
    'Ingredients:\n- Pasta\n- Eggs\n- Pancetta\n- Parmesan\n- Black pepper',
    'yellow',
    false,
    4,
    'done'
  ),
];
