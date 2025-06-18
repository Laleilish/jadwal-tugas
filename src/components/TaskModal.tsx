"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CalendarDays, Clock, LinkIcon, X } from "lucide-react";
import { Task } from "@/lib/types";

export default function TaskModal(task: Task) {
  const [open, setOpen] = useState(false);

  return (
    <div id={task.id}>
      <button onClick={() => setOpen(true)} className="">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {task.name}
        </span>
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <DialogTitle className="flex justify-end">
                <button className="m-2" onClick={() => setOpen(false)}>
                  <X
                    className="hover:text-gray-600 text-gray-400 dark:text-gray-500 transition-colors"
                    size={20}
                  />
                </button>
              </DialogTitle>
              {/* Dialog Content */}
              <div className="flex flex-col px-10 py-5 text-center">
                <div className="text-lg mb-5">{task.name}</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <CalendarDays
                      size={20}
                      className="mr-2 text-gray-400 dark:text-gray-500"
                    />
                    <span className="text-sm sm:text-base">{task.deadlineDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock
                      size={20}
                      className="mr-2 text-gray-400 dark:text-gray-500"
                    />
                    <span className="text-sm sm:text-base">{task.deadlineTime}</span>
                  </div>
                </div>
                <hr className="my-4" />
                {/* Link Buttons */}
                <div className="flex justify-center">
                  <a
                    href={task.attachmentLink}
                    className="inline-flex gap-2 py-2.5 px-5 me-2 mb-2 text-xs sm:text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <span>Tugas</span>
                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                      <LinkIcon className="w-full h-full text-blue-500" />
                    </div>
                  </a>
                  <a
                    href={task.submitLink}
                    className="inline-flex gap-2 py-2.5 px-5 me-2 mb-2 text-xs sm:text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <span>Submit</span>
                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                      <LinkIcon className="w-full h-full text-blue-500" />
                    </div>
                  </a>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
