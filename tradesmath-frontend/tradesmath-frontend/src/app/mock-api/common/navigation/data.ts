/* tslint:disable:max-line-length */
import { FuseNavigationItem, appRolesInfo } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'user-interface.dashboard',
        type: 'basic',
        title: 'Dashboard',
        icon: 'heroicons_outline:chart-pie',
        userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
        link: '/app/dashboard',
    },
    {
        id: 'user-interface.topics',
        type: 'collapsable',
        title: 'Topics',
        userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
        icon: 'heroicons_outline:clipboard-list',
        children: [
            {
                id: 'user-interface.topics.add',
                title: 'Create Topics',
                type: 'basic',
                link: '/app/topics',
                userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
            },
            {
                id: 'user-interface.topics.list',
                title: 'View all topics',
                type: 'basic',
                link: '/app/view-topics',
                userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
            },
        ],
    },
    {
        id: 'user-interface.questions',
        type: 'collapsable',
        title: 'Questions',
        icon: 'heroicons_outline:academic-cap',
        userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
        children: [
            {
                id: 'user-interface.questions.add',
                title: 'Create Questions',
                type: 'basic',
                link: '/app/questions',
                userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
            },
            {
                id: 'user-interface.questions.list',
                title: 'View Questions',
                type: 'basic',
                link: '/app/view-questions',
                userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
            },
        ],
    },
    {
        id: 'user-interface.invitations',
        type: 'basic',
        title: 'Generate Invitations',
        icon: 'heroicons_outline:user-group',
        userType: `${appRolesInfo.superAdmin}`,
        link: '/app/generate-invitation',
    },
    {
        id: 'user-interface.users',
        type: 'basic',
        title: 'Users',
        icon: 'heroicons_outline:user-group',
        userType: `${appRolesInfo.superAdmin}`,
        link: '/app/users',
    },
    {
        id: 'user-interface.student-topics',
        type: 'basic',
        title: 'Home',
        link: 'student/topic-detail',
        userType: `${appRolesInfo.user}`,
        icon: 'heroicons_outline:home',
    },
    {
        id: 'user-interface.student-topics',
        type: 'basic',
        title: 'All Topics',
        link: '/student/topics',
        userType: `${appRolesInfo.user}`,
        icon: 'heroicons_outline:clipboard-list',
    },
    // {
    //     id: 'user-interface.student-topics',
    //     type: 'basic',
    //     title: 'Guides',
    //     link: '/app/guides',
    //     userType: `${appRolesInfo.admin},${appRolesInfo.superAdmin}`,
    //     icon: 'heroicons_outline:clipboard-list',
    // },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/app',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/app',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/app',
    },
];
