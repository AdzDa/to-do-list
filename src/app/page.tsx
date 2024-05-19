'use client'
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CheckIcon, TrashIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

export default function Home() {

  const [date, setDate] = useState<Date>()
  const [pendingTaskList, setPendingTaskList] = useState([{
    title: 'Clean dishes',
    date: '19 May 2024',
    isCompleted: false,
  }]) 
  const [completedTaskList, setCompletedTaskList] = useState([{
    title: 'Read book',
    date: '19 May 2024',
    isCompleted: true,
  }]) 
  const [newTask, setNewTask] = useState <any>({
    title: '',
    date: new Date()
  })
  const addNewTaskTodb = () => {
    // push data(new task) to supabase
  }

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
          <Input className="w-full" value={newTask.title} onChange={(e) => setNewTask({
            ...newTask, //copying previous data
            title: e.target.value,
          })} type="text" placeholder="eg: Clean bathroom" />
        </div>

        <div>
          <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={newTask.date}
              onSelect={(selectedDate) => setNewTask({
                ...newTask, 
                date: selectedDate,
              }) }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        </div>
        
        <div>
          <Button className="px-10">Add</Button>
        </div>
      </div>

      {/* Title New task */}
      <div className="py-5 mx-5 font-bold">
        Task List
      </div>

      {/* New task list */}
      {/* Div for whole component or task list */}
      <div className="mx-5">
        {/* New task component */}
        {
            pendingTaskList.map((task, index) => (
            <div key={index} className="flex rounded-lg w-full bg-green-100 px-5 py-5 space-x-2">
              <div className="flex flex-col w-full">
                <p>{task.title}</p>
                <p className="text-gray-500 text-sm">{task.date}</p>
              </div>

              <div>
                <Button className="bg-green-500">
                  <CheckIcon size={22}/>
                </Button>
              </div>

              <div>
                <Button className="bg-red-500">
                  <TrashIcon size={22}/>
                </Button>
              </div>
            </div>
            ))  
        }
      </div>

      {/* Title- completed task */}
      <div className="py-5 mx-5 font-bold">
        Completed Task
      </div>

      {/* Completed task list */}
      <div className="mx-5">
        {
          completedTaskList.map((task, index) => (
            <div key={index} className="flex rounded-lg w-full bg-gray-200 px-5 py-5 space-x-2">
              <div className="flex w-full items-center">
                <p className="text-gray-500 line-through">{task.title}</p>
              </div>

              <div className="w-28">
                <p className="text-gray-500 text-sm">Completed on:</p>
                <p className="text-gray-500 text-sm">{task.date}</p>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  );
}
