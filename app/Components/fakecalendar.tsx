"use client"

const FakeGitHubCalendar = () => {
  // Création de 95 jours, répartis sur plusieurs lignes de 7 jours
  const days = Array(315).fill(false).map(() => Math.random() < 0.5); // Random pour simuler des commits

  return (
    <div className="bg-[#241730] transition-all overflow-hidden duration-200 w-full h-[250px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center">
      <div className="grid grid-cols-7 gap-1 rotate-90">
        {/* Afficher les 95 jours dans un format de plusieurs lignes */}
        {days.map((hasCommit, index) => (
          <div
            key={index}
            className={`w-[25px] h-[25px] ${
              hasCommit ? "bg-violet-700" : "bg-[#160E1E]"
            } rounded-md`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FakeGitHubCalendar;
