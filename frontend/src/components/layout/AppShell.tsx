'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, PlayCircle, User, Award, LogOut, Sprout, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setUser } from '@/store/slices/authSlice';
import { useGetMeQuery, useLogoutMutation } from '@/services/api';
import { useTheme } from '@/hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import Avatar from '../ui/Avatar';
import styles from './AppShell.module.css';

type NavItem = { href: string; label: string; icon: typeof Home; exact?: boolean };

const navItems: NavItem[] = [
    { href: '/app', label: 'Início', icon: Home, exact: true },
    { href: '/app/conteudos', label: 'Aulas Teóricas', icon: BookOpen },
    { href: '/app/pratico', label: 'Projeto Prático', icon: PlayCircle },
    { href: '/app/perfil', label: 'Perfil', icon: User },
    { href: '/app/certificados', label: 'Certificados', icon: Award },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();

    // RTK Query hooks
    const { data: userData, isError } = useGetMeQuery();
    const [triggerLogout] = useLogoutMutation();


    // State Synchronization Review: Only dispatch if data exists and is different from current state
    // This prevents unnecessary re-renders and keeps the authSlice lightweight.
    useEffect(() => {
        if (userData && userData.id !== user.id) {
            dispatch(setUser({ 
                id: userData.id, 
                name: userData.name, 
                email: userData.email, 
                avatarUrl: userData.avatarUrl ?? null, 
                role: userData.role,
                streakCount: userData.streakCount ?? 0,
                createdAt: userData.createdAt ?? null 
            }));
        }
    }, [dispatch, userData, user.id]);

    // Redirect to login if /auth/me fails (unauthorized)
    useEffect(() => {
        if (isError) {
            router.push('/login');
        }
    }, [isError, router]);

    const handleLogout = async () => {
        try {
            await triggerLogout().unwrap();
        } catch (error) {
            console.error("Logout API call failed: ", error);
        } finally {
            // Clear Redux state and redirect regardless of API success
            dispatch(logout());
            router.push('/');
        }
    }

    const isActive = (item: NavItem) => {
        return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    };

    return (
        <div className={styles.shell}>
            <Toaster position="top-right"/>
            {/* Desktop Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brandLogo}>
                        <Sprout size={20} />
                    </div>
                    <div className={styles.brandTextContainer}>
                        <span className={styles.brandName}>Coleta-Cacau</span>
                        <span className={styles.brandSubtitle}>Academy</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive(item) ? styles.navLinkActive : ''}`}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {user.id && (
                    <div className={styles.sidebarFooter}>
                        <div className={styles.userBox}>
                            {/* Safely render avatar only if URL exists */}
                            <Avatar src={user.avatarUrl} name={user.name} className={styles.userAvatar} />
                            <div className={styles.userInfo}>
                                <p className={styles.userName}>{user.name}</p>
                                <p className={styles.userEmail}>{user.email}</p>
                            </div>
                            <button 
                                onClick={toggleTheme} 
                                title="Mudar tema" 
                                aria-label="Mudar tema" 
                                className={styles.logoutBtn} 
                                style={{ marginRight: '0.5rem' }}
                            >
                                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            </button>
                            <button onClick={handleLogout} title="Sair" className={styles.logoutBtn}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Top Bar */}
            <div className={styles.mobileTopBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.brandLogo} style={{ width: '2rem', height: '2rem' }}>
                        <Sprout size={16} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Coleta-Cacau</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                        onClick={toggleTheme} 
                        aria-label="Mudar tema" 
                        className={styles.logoutBtn}
                        style={{ width: '2rem', height: '2rem' }}
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                    {user.id && (
                        <Avatar src={user.avatarUrl} name={user.name} className={styles.userAvatar} />
                    )}
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className={styles.mobileNav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobileNavLink} ${isActive(item) ? styles.mobileNavLinkActive : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label.split(' ')[0]}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
