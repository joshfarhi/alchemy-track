import { Cannabis } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Cannabis className="stroke h-10 w-10 stroke-white stroke-[1.5]" />
      <p className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Kush Tracker
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Kush Tracker
      </p>
    </a>
  );
}

export default Logo;
