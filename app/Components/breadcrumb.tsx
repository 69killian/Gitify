"use client"

import Link from "next/link";

const Breadcrumb = () => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-5">
      <ol className="flex space-x-2">
        <li>
          <Link href="/" className="hover:text-violet-700 transition duration-200">
            Gitify
          </Link>
        </li>
        <li>
          <span className="text-gray-500">/</span>
        </li>
        <li>
          <Link href="/projects" className="hover:text-violet-700 transition duration-200 text-violet-700">
            Accueil
          </Link>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
