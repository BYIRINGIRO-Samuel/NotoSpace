export const admindashboardlinks = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/admindashboard",
        label: "Dashboard",
    },
    {
        imgURL: "/assets/icons/students.svg",
        route: "/manageusers",
        label: "Manage Users",
        children: [
            {
                imgURL: "/assets/icons/videos.svg",
                route: "/admin/teachers",
                label: "Teachers",
            },
            {
                imgURL: "/assets/icons/videos.svg",
                route: "/admin/students",
                label: "Students",
            },
        ],
    },
    {
        imgURL: "/assets/icons/notification.svg",
        route: "/admin/notifications",
        label: "Notifications",
    },
    {
        imgURL: "/assets/icons/setting_1.svg",
        route: "/admin/settings",
        label: "Settings",
    }
]
