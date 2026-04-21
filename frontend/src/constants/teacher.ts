export const teacherdashbordlinks = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/teacherdashboard",
      label: "Dashboard",
    },
    {
      imgURL: "/assets/icons/lessons.svg",
      route: "/lessons",
      label: "Lessons",
      children: [
        {
          imgURL: "/assets/icons/videos.svg",
          route: "/teacherdashboard/lessons/uploadvideos",
          label: "Videos",
        },
        {
          imgURL: "/assets/icons/notes.svg",
          route: "/teacherdashboard/lessons/uploadnotes",
          label: "Notes",
        },
      ],
    },
    {
      imgURL: "/assets/icons/quizzes.svg",
      route: "/teacherdashboard/assignments",
      label: "Assignments",
    },
    {
      imgURL: "/assets/icons/upload.svg",
      route: "/teacherdashboard/uploads",
      label: "Uploads",
    },
    {
      imgURL: "/assets/icons/students.svg",
      route: "/teacherdashboard/students",
      label: "Students",
    },
    {
      imgURL: "/assets/icons/report.svg",
      route: "/teacherdashboard/timetables",
      label: "Timetables",
    },
    {
      imgURL: "/assets/icons/setting_1.svg",
      route: "/teacherdashboard/settings",
      label: "Settings",
    },
  ];
  
