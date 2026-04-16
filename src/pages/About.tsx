import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Globe, Mail, Gpu, ChevronRight } from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center py-6 shrink-0 mt-4">
        <h1 className="text-4xl font-bold text-text tracking-tight">
          About Me
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-inputBg hover:bg-border rounded-full flex items-center justify-center transition-colors text-text"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="max-w-2xl mx-auto pb-10 flex flex-col items-center">
          {/* PROFILE SECTION */}
          <div className="flex flex-col items-center mt-6 mb-10">
            <div className="w-32 h-32 rounded-full mb-6 shadow-xl shadow-primary/20 p-1 bg-gradient-to-tr from-primary to-purple-500">
              {!imageError ? (
                <img
                  src="https://github.com/Ayoub-EDAHLOULI.png"
                  alt="Ayoub Edahlouli"
                  className="w-full h-full rounded-full border-4 border-card object-cover bg-card"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-card bg-primary flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">AE</span>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-text mb-2">
              Ayoub Edahlouli
            </h2>
            <p className="text-primary font-semibold text-lg tracking-wide">
              Full Stack Developer & AI Engineer
            </p>
          </div>

          {/* BIO SECTION */}
          <div className="bg-card border border-border rounded-3xl p-8 mb-10 shadow-sm w-full text-center">
            <p className="text-text text-lg leading-relaxed mb-4">
              I built <span className="font-bold text-primary">NeuroKey</span>{" "}
              because I needed a secure place for my own digital life—and I knew
              others did too.
            </p>
            <p className="text-text text-lg leading-relaxed">
              Managing passwords shouldn't be a headache. It should be
              beautiful, fast, and private. This app is my solution to a problem
              we all face.
            </p>
          </div>

          {/* LINKS SECTION */}
          <div className="w-full">
            <h3 className="text-xs font-bold text-subText mb-3 tracking-wider uppercase ml-2">
              Connect With Me
            </h3>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <a
                href="https://ayoubedahlouli.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-4 border-b border-border hover:bg-inputBg transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-4">
                  <Globe size={20} className="text-white" />
                </div>
                <span className="flex-1 text-text font-medium text-lg">
                  Portfolio Website
                </span>
                <ChevronRight
                  size={20}
                  className="text-subText group-hover:text-primary transition-colors"
                />
              </a>

              <a
                href="mailto:ayoub.edahlouli@gmail.com"
                className="flex items-center px-6 py-4 border-b border-border hover:bg-inputBg transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mr-4">
                  <Mail size={20} className="text-white" />
                </div>
                <span className="flex-1 text-text font-medium text-lg">
                  Email Me
                </span>
                <ChevronRight
                  size={20}
                  className="text-subText group-hover:text-primary transition-colors"
                />
              </a>

              <a
                href="https://github.com/Ayoub-EDAHLOULI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-4 hover:bg-inputBg transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mr-4">
                  <Gpu size={20} className="text-white" />
                </div>
                <span className="flex-1 text-text font-medium text-lg">
                  GitHub
                </span>
                <ChevronRight
                  size={20}
                  className="text-subText group-hover:text-primary transition-colors"
                />
              </a>
            </div>
          </div>

          <p className="text-subText mt-12 mb-4 opacity-60">
            Made with ❤️ in Morocco
          </p>
        </div>
      </div>
    </div>
  );
}
