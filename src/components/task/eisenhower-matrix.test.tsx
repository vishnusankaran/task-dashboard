import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { EisenhowerMatrix } from './eisenhower-matrix';
import { TaskContext } from '@/context/task';
import type { Task, TaskArray, User, StatusType } from '@/types';

// Mock UI components
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`mock-badge ${className}`}>{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`mock-card ${className}`}>{children}</div>,
  CardHeader: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`mock-card-header ${className}`}>{children}</div>,
  CardTitle: ({ children, className }: { children: React.ReactNode, className?: string }) => <h5 className={`mock-card-title ${className}`}>{children}</h5>,
  CardContent: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`mock-card-content ${className}`}>{children}</div>,
}));

// Mock lucide-react icons (if they were directly used in EisenhowerMatrix, which they aren't, but good practice)
// vi.mock('lucide-react', () => ({ /* ... mock specific icons if needed ... */ }));

const mockUser: User = { id: 'u1', name: 'Test User', email: 'test@example.com' };

const createMockTask = (id: string, title: string, importance: boolean, urgency: boolean, status: StatusType = 'pending', description?: string): Task => ({
  id,
  title,
  description,
  dueDate: new Date(),
  status,
  importance,
  urgency,
  user: mockUser,
});

const mockTasks: Task[] = [
  createMockTask('1', 'Task UI - Urgent & Important', true, true),
  createMockTask('2', 'Task INU - Important & Not Urgent', true, false),
  createMockTask('3', 'Task UNI - Urgent & Not Important', false, true),
  createMockTask('4', 'Task UNINU - Not Urgent & Not Important', false, false),
  createMockTask('5', 'Another UI Task', true, true, 'in-progress'),
];

const renderWithContext = (tasks: TaskArray, fetching = false, error: Error | null = null) => {
  const mockFetchTasks = vi.fn();
  const mockSetActiveTask = vi.fn();
  return render(
    <TaskContext.Provider value={{ tasks, fetchTasks: mockFetchTasks, result: { fetching, error }, activeTask: null, setActiveTask: mockSetActiveTask }}>
      <EisenhowerMatrix />
    </TaskContext.Provider>
  );
};

describe('EisenhowerMatrix Component', () => {
  test('renders all quadrant titles', () => {
    renderWithContext([]);
    expect(screen.getByText('Urgent & Important (Do First)')).toBeInTheDocument();
    expect(screen.getByText('Important & Not Urgent (Schedule)')).toBeInTheDocument();
    expect(screen.getByText('Urgent & Not Important (Delegate)')).toBeInTheDocument();
    expect(screen.getByText('Not Urgent & Not Important (Eliminate)')).toBeInTheDocument();
  });

  test('displays loading message when fetching and no tasks are present', () => {
    renderWithContext([], true);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('displays error message when an error occurs', () => {
    renderWithContext([], false, new Error('Failed to fetch'));
    expect(screen.getByText(/Error loading tasks: Failed to fetch/i)).toBeInTheDocument();
  });

  test('displays "No tasks available" message when tasks array is empty and not loading', () => {
    renderWithContext([], false);
    // Check for the main "No tasks available" message, not the per-quadrant one.
    // The component shows individual "No tasks in this category" if there are no tasks for a specific quadrant,
    // but a general message if the initial tasks array is empty.
    expect(screen.getByText('No tasks available to display.')).toBeInTheDocument();
  });

  describe('Task Categorization', () => {
    test('correctly categorizes a mix of tasks', () => {
      renderWithContext(mockTasks);

      const urgentImportantQuadrant = screen.getByText('Urgent & Important (Do First)').closest('.mock-card');
      expect(within(urgentImportantQuadrant!).getByText('Task UI - Urgent & Important')).toBeInTheDocument();
      expect(within(urgentImportantQuadrant!).getByText('Another UI Task')).toBeInTheDocument();

      const importantNotUrgentQuadrant = screen.getByText('Important & Not Urgent (Schedule)').closest('.mock-card');
      expect(within(importantNotUrgentQuadrant!).getByText('Task INU - Important & Not Urgent')).toBeInTheDocument();

      const urgentNotImportantQuadrant = screen.getByText('Urgent & Not Important (Delegate)').closest('.mock-card');
      expect(within(urgentNotImportantQuadrant!).getByText('Task UNI - Urgent & Not Important')).toBeInTheDocument();

      const notUrgentNotImportantQuadrant = screen.getByText('Not Urgent & Not Important (Eliminate)').closest('.mock-card');
      expect(within(notUrgentNotImportantQuadrant!).getByText('Task UNINU - Not Urgent & Not Important')).toBeInTheDocument();
    });

    test('handles tasks all in one quadrant (Urgent & Important)', () => {
      const singleCategoryTasks = [
        createMockTask('s1', 'Super Critical', true, true),
        createMockTask('s2', 'Very Urgent', true, true),
      ];
      renderWithContext(singleCategoryTasks);

      const urgentImportantQuadrant = screen.getByText('Urgent & Important (Do First)').closest('.mock-card');
      expect(within(urgentImportantQuadrant!).getByText('Super Critical')).toBeInTheDocument();
      expect(within(urgentImportantQuadrant!).getByText('Very Urgent')).toBeInTheDocument();

      const importantNotUrgentQuadrant = screen.getByText('Important & Not Urgent (Schedule)').closest('.mock-card');
      expect(within(importantNotUrgentQuadrant!).getByText('No tasks in this category.')).toBeInTheDocument();

      const urgentNotImportantQuadrant = screen.getByText('Urgent & Not Important (Delegate)').closest('.mock-card');
      expect(within(urgentNotImportantQuadrant!).getByText('No tasks in this category.')).toBeInTheDocument();

      const notUrgentNotImportantQuadrant = screen.getByText('Not Urgent & Not Important (Eliminate)').closest('.mock-card');
      expect(within(notUrgentNotImportantQuadrant!).getByText('No tasks in this category.')).toBeInTheDocument();
    });

    test('handles empty quadrants correctly when some tasks exist', () => {
      const tasksLeavingEmptyQuadrants = [
        createMockTask('e1', 'Only Urgent & Important', true, true),
        createMockTask('e2', 'Only Not Urgent & Not Important', false, false),
      ];
      renderWithContext(tasksLeavingEmptyQuadrants);

      const urgentImportantQuadrant = screen.getByText('Urgent & Important (Do First)').closest('.mock-card');
      expect(within(urgentImportantQuadrant!).getByText('Only Urgent & Important')).toBeInTheDocument();

      const importantNotUrgentQuadrant = screen.getByText('Important & Not Urgent (Schedule)').closest('.mock-card');
      expect(within(importantNotUrgentQuadrant!).getByText('No tasks in this category.')).toBeInTheDocument();

      const urgentNotImportantQuadrant = screen.getByText('Urgent & Not Important (Delegate)').closest('.mock-card');
      expect(within(urgentNotImportantQuadrant!).getByText('No tasks in this category.')).toBeInTheDocument();

      const notUrgentNotImportantQuadrant = screen.getByText('Not Urgent & Not Important (Eliminate)').closest('.mock-card');
      expect(within(notUrgentNotImportantQuadrant!).getByText('Only Not Urgent & Not Important')).toBeInTheDocument();
    });

    test('calls fetchTasks if tasks array is empty and not fetching', () => {
        const mockFetchTasks = vi.fn();
        render(
            <TaskContext.Provider value={{ tasks: [], fetchTasks: mockFetchTasks, result: { fetching: false, error: null }, activeTask: null, setActiveTask: vi.fn() }}>
              <EisenhowerMatrix />
            </TaskContext.Provider>
        );
        // The component initially shows "No tasks available", then useEffect triggers fetch.
        // We are testing if fetchTasks was called.
        expect(mockFetchTasks).toHaveBeenCalledTimes(1);
    });

    test('does not call fetchTasks if tasks array is populated', () => {
        const mockFetchTasks = vi.fn();
        render(
            <TaskContext.Provider value={{ tasks: [createMockTask('t1', 'test', true, true)], fetchTasks: mockFetchTasks, result: { fetching: false, error: null }, activeTask: null, setActiveTask: vi.fn() }}>
              <EisenhowerMatrix />
            </TaskContext.Provider>
        );
        expect(mockFetchTasks).not.toHaveBeenCalled();
    });

     test('does not call fetchTasks if fetching is true', () => {
        const mockFetchTasks = vi.fn();
        render(
            <TaskContext.Provider value={{ tasks: [], fetchTasks: mockFetchTasks, result: { fetching: true, error: null }, activeTask: null, setActiveTask: vi.fn() }}>
              <EisenhowerMatrix />
            </TaskContext.Provider>
        );
        expect(mockFetchTasks).not.toHaveBeenCalled();
    });
  });
});
