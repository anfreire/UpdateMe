import "@/src/index.css";
import Source from "../music/common/source";
import Command from "@/src/common/command";
import { AlertTriangle } from "lucide-react";

export default function Microsoft() {
  return (
    <div className="smart-x-padding smart-y-padding flex h-screen-no-navbar w-full flex-col items-center gap-6 overflow-y-auto sm:gap-8 md:gap-12 lg:gap-16 xl:gap-24">
      <div className="flex w-80 max-w-fit flex-row items-center justify-center gap-4 rounded-md border border-yellow-500 bg-[rgba(234,179,8,0.1)] p-4 xl:w-96">
        <div className="flex items-center justify-center">
          <AlertTriangle className="size-10 stroke-current stroke-1 sm:size-12 md:size-16 xl:size-20" />
        </div>
        <div className="flex items-center justify-center text-center text-lg font-bold md:text-xl xl:text-2xl">
          <p>This will only work on Windows 8.1 and above</p>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
        Microsoft Activation Scripts (MAS)
      </h1>
      <p className="px-10 text-center text-base sm:px-12 md:px-14 md:text-lg lg:px-20 lg:text-xl xl:px-24 xl:text-2xl">
        A Windows and Office activator using HWID / Ohook / KMS38 / Online KMS
        activation methods, with a focus on open-source code and fewer antivirus
        detections.
      </p>
      <div className="mt-6 flex w-full flex-col gap-4 md:mt-8 md:gap-6 lg:mt-10 xl:mt-12 xl:gap-8">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          Download / How to use it?
        </h1>
        <ul className="text-justify text-base md:text-lg xl:text-xl">
          <li>
            - Right-click on the Windows start menu and select PowerShell or
            Terminal (Not CMD).
          </li>
          <li className="flex flex-col justify-center gap-2 lg:flex-row lg:items-center lg:justify-start">
            - Copy-paste the command below and press enter.
          </li>
          <li>
            - You will see the activation options, and follow onscreen
            instructions.
          </li>
        </ul>
      </div>
      <Command command="irm https://massgrave.dev/get | iex" />
      <Source link="https://github.com/massgravel/Microsoft-Activation-Scripts" />
    </div>
  );
}
