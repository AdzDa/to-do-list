'use client';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckIcon, TrashIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { createSupabaseClient } from '@/utils/supabase/client';
import moment from 'moment';

export default function Home() {
	const supabase = createSupabaseClient();

	const [pendingTaskList, setPendingTaskList] = useState([
		{
			title: '',
			date: '',
			isCompleted: false,
			completedDate: '',
		},
	]);
	const [completedTaskList, setCompletedTaskList] = useState([
		{
			title: '',
			date: '',
			isCompleted: true,
			completedDate: '',
		},
	]);
	const [newTask, setNewTask] = useState<any>({
		title: '',
		date: new Date(),
	});
	const addNewTaskToDB = async () => {
		// push data(new task) to supabase
		const { error } = await supabase.from('todos').insert({
			title: newTask.title,
			date: newTask.date,
		});
		console.log(error);
		setNewTask({
			title: '',
			date: new Date(),
		});
		// pulling the new updated database
		getPendingTaskFromDB();
	};

	const deleteTaskFromDB = async (task: any) => {
		// delete task from db
		const { error } = await supabase.from('todos').delete().eq('id', task.id);
		console.log(error);
		getPendingTaskFromDB();
	};

	const markTaskAsCompleted = async (task: any) => {
		const { error } = await supabase
			.from('todos')
			.update({ is_completed: true, completed_date: new Date() })
			.eq('id', task.id);
		console.log(error);
		getPendingTaskFromDB();
		getCompletedTaskFromDB();
	};

	const getPendingTaskFromDB = async () => {
		const { data: pendingTasks } = await supabase
			.from('todos')
			.select()
			.eq('is_completed', false);
		// map the todos to match the format of pendingTaskList
		const formattedTodos: any = pendingTasks?.map((todo) => ({
			id: todo.id,
			title: todo.title,
			date: moment(todo.date).format('DD-MM-YYYY'),
			isCompleted: todo.is_completed,
		}));
		// console.log(formattedTodos);
		setPendingTaskList(formattedTodos);
	};

	const getCompletedTaskFromDB = async () => {
		const { data: completedTasks } = await supabase
			.from('todos')
			.select()
			.eq('is_completed', true);

		const formattedTodos: any = completedTasks?.map((todo) => ({
			id: todo.id,
			title: todo.title,
			date: moment(todo.date).format('DD-MM-YYYY'),
			isCompleted: todo.is_completed,
			completedDate: moment(todo.completed_date).format('DD-MM-YYYY'),
		}));
		setCompletedTaskList(formattedTodos);
	};

	useEffect(() => {
		getPendingTaskFromDB();
		getCompletedTaskFromDB();
	}, []);

	// useEffect(() => {
	//   console.log('Date: ', newTask.date)
	//   console.log('Title:', newTask.title)
	// },[newTask.date, newTask.title])

	return (
		<div>
			{/* Title box */}
			<div className="flex justify-center py-5 bg-blue-100 text-xl font-bold">
				To Do List
			</div>

			{/* Input div */}
			<div className="flex w-full px-5 my-5 space-x-2">
				<div className="w-full">
					<Input
						className="w-full"
						value={newTask.title}
						onChange={(e) =>
							setNewTask({
								...newTask, //copying previous data
								title: e.target.value,
							})
						}
						type="text"
						placeholder="eg: Clean bathroom"
					/>
				</div>

				<div>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={'outline'}
								className={cn(
									'w-[280px] justify-start text-left font-normal',
									!newTask.date && 'text-muted-foreground'
								)}>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{newTask.date ? (
									format(newTask.date, 'PPP')
								) : (
									<span>Pick a date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={newTask.date}
								onSelect={(selectedDate) => {
									setNewTask({
										...newTask,
										date: selectedDate,
									});
								}}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>

				<div>
					<Button onClick={() => addNewTaskToDB()} className="px-10">
						Add
					</Button>
				</div>
			</div>

			{/* Title New task */}
			<div className="py-5 mx-5 font-bold">Task List</div>

			{/* New task list */}
			{/* Div for whole component or task list */}
			<div className="mx-5 space-y-2">
				{/* New task component */}
				{pendingTaskList.map((task, index) => (
					<div
						key={index}
						className="flex rounded-lg w-full bg-green-100 px-5 py-5 space-x-2">
						<div className="flex flex-col w-full">
							<p>{task.title}</p>
							<p className="text-gray-500 text-sm">{task.date}</p>
						</div>

						<div>
							<Button
								onClick={() => markTaskAsCompleted(task)}
								className="bg-green-500">
								<CheckIcon size={22} />
							</Button>
						</div>

						<div>
							<Button
								onClick={() => deleteTaskFromDB(task)}
								className="bg-red-500">
								<TrashIcon size={22} />
							</Button>
						</div>
					</div>
				))}
			</div>

			{/* Title- completed task */}
			<div className="py-5 mx-5 font-bold">Completed Task</div>

			{/* Completed task list */}
			<div className="mx-5 space-y-2">
				{completedTaskList.map((task, index) => (
					<div
						key={index}
						className="flex rounded-lg w-full bg-gray-200 px-5 py-5 space-x-2">
						<div className="flex w-full items-center">
							<p className="text-gray-500 line-through">{task.title}</p>
						</div>

						<div className="w-28">
							<p className="text-gray-500 text-sm">Completed on:</p>
							<p className="text-gray-500 text-sm">{task.completedDate}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
