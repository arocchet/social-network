"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, PlusSquare } from "lucide-react";
import type React from "react";

const CreatePost: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
        >
          <PlusSquare className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[var(--bgLevel1)]">
            <DialogTitle className="text-lg font-semibold">
              Créer un post
            </DialogTitle>
            <DialogClose asChild>
            </DialogClose>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[var(--bgLevel1)]">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div>
                <p className="font-medium text-sm">Utilisateur</p>
                <p className="text-xs text-[var(--textNeutral)]">Public</p>
              </div>
            </div>

            {/* Text input */}
            <div className="space-y-3">
              <textarea
                placeholder="Que voulez-vous partager ?"
                className="w-full min-h-[120px] p-3 text-base resize-none border-1 border-[var(--detailMinimal)] rounded-lg outline-none bg-[var(--bgLevel2)] placeholder:text-[var(--textNeutral)]"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Media upload area */}
            <div className="border-2 border-dashed border-[var(--detailMinimal)] bg-[var(--bgLevel2)] rounded-lg p-8 text-center hover:border-[var(--detailNeutralAlt)] transition-colors cursor-pointer">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-[var(--bgLevel1)] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[var(--textNeutral)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Ajouter des photos/vidéos</p>
                <p className="text-xs text-[var(--textNeutral)]">
                  ou glissez-déposez
                </p>
              </div>
            </div>

            {/* Options */}
            {/* <div className="flex items-center justify-between p-3 bg-[var(--bgLevel1)] rounded-lg">
              <span className="text-sm font-medium">Ajouter à votre post</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[var(--bgLevel2)] rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-[var(--bgLevel2)] rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-[var(--bgLevel2)] rounded-full transition-colors">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-[var(--bgLevel1)]">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Publier
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
