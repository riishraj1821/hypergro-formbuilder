import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Header from "~/components/Header";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const meta: MetaFunction = () => {
  return [
    { title: "HyperGro forms" },
    { name: "description", content: "Welcome to HyperGro form builder" },
  ];
};

const featureCards = [
  {
    title: "Drag & Drop Interface",
    description: "Easily add and arrange form fields with our intuitive drag-and-drop builder.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Validation",
    description: "Get instant feedback with built-in validation for all form fields.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Easy Sharing",
    description: "Share your forms with a unique link and collect responses instantly.",
    icon: (
      <svg
        className="h-6 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
    ),
  },
];

export default function Index() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <div className="heroGradient absolute left-1/2 top-[40%] h-2/5 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:blur-[150px] opacity-80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-blue-600 sm:text-5xl md:text-6xl">
              <span className="block">Create Beautiful Forms</span>
              <span className="block bg-gradient-to-r max-w-fit mx-auto text-center from-purple-600 to-pink-500 bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build custom forms with our intuitive drag-and-drop interface. Add
              fields, configure settings, and share your forms with others in
              seconds.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="shadow relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <Link
                  to="/builder"
                  className="w-full text-black hover:text-white dark:text-white font-bold flex items-center justify-center px-8 py-3 border border-transparent text-base md:py-4 md:text-lg md:px-10  relative  transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent"
                >
                  Start Building
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card, index) => (
                <div
                  key={card.title}
                  className="pt-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  <div className="flow-root bg-white dark:bg-gray-800 rounded-lg px-6 pb-8 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-pink-500/0 rounded-lg group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-300" />
                    <div className="-mt-6 relative">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
