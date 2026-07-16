'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetModulesQuery, useUpdateMyProfileMutation, useGetMeQuery, useLogoutMutation } from '@/services/api';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, Trophy, Edit, Check, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import { ErrorFound } from '@/components/ui/PageError';
import { getEntrySemester } from '@/utils/formateDate';
import toast from 'react-hot-toast';
import styles from './page.module.css';


export default function PerfilPage() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const { data, isLoading, isError } = useGetModulesQuery();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(user?.name || '');
    const [updateMyProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
    const [logoutApi] = useLogoutMutation();

    // Dynamic Progress Calculations
    const modules = data ?? [];
    const theoryLessons = modules.filter(m => m.type === 'THEORY').flatMap(m => m.lessons);
    const theoryDone = theoryLessons.filter(l => l.done).length;
    const theoryTotal = theoryLessons.length;
    const theoryPct = theoryTotal > 0 ? Math.round((theoryDone / theoryTotal) * 100) : 0;

    const videoLessons = modules.filter(m => m.type === 'PRACTICAL').flatMap(m => m.lessons);
    const videoDone = videoLessons.filter(l => l.done).length;
    const videoTotal = videoLessons.length;
    const videoPct = videoTotal > 0 ? Math.round((videoDone / videoTotal) * 100) : 0;

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error('Logout failed', error);
        }
        dispatch(logout());
        router.push('/');
    };

    const handleSaveName = async () => {
        const trimmedName = tempName.trim();
        if (trimmedName.length < 3) {
            toast.error('O nome deve ter no mínimo 3 caracteres.');
            return;
        }
        try {
            await updateMyProfile({ name: trimmedName }).unwrap();
            toast.success('Perfil atualizado com sucesso!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Erro ao atualizar perfil.');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.profileCard}>
                    <Skeleton style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                    <div className={styles.userInfo}>
                        <Skeleton style={{ width: '150px', height: '24px', marginBottom: '8px' }} />
                        <Skeleton style={{ width: '200px', height: '16px', marginBottom: '8px' }} />
                        <Skeleton style={{ width: '120px', height: '16px' }} />
                    </div>
                </div>
                <div className={styles.statsGrid}>
                    <Skeleton style={{ width: '100%', height: '120px', borderRadius: '12px' }} />
                    <Skeleton style={{ width: '100%', height: '120px', borderRadius: '12px' }} />
                </div>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className={styles.pageContainer}>
                <ErrorFound message='Erro ao carregar os dados do perfil.' />
            </div>
        );
    }

    if (!user || !user.id) {
        return null;
    }

    const entrySemester = user.createdAt ? getEntrySemester(user.createdAt) : '';

    return (
        <div className={styles.pageContainer}>
            {/* Profile Header */}
            <div className={styles.profileCard}>
                <Avatar src={user.avatarUrl} name={user.name} className={styles.avatar} />
                
                <div className={styles.userInfo}>
                    {isEditing ? (
                        <div className={styles.editNameRow}>
                            <input 
                                type="text" 
                                value={tempName!} 
                                onChange={(e) => setTempName(e.target.value)} 
                                className={styles.nameInput}
                            />
                            <button onClick={handleSaveName} disabled={isUpdating} className={styles.saveBtn}>
                                <Check size={16} />
                            </button>
                            <button onClick={() => { setTempName(user.name || ''); setIsEditing(false); }} className={styles.cancelBtn} >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.nameRow}>
                            <h1 className={styles.userName}>{user.name}</h1>
                            <button onClick={() => { setTempName(user.name || ''); setIsEditing(true); }} className={styles.editBtn}>
                                <Edit size={16} />
                            </button>
                        </div>
                    )}
                    <p className={styles.emailRow}>
                        <Mail size={16} /> {user.email}
                    </p>
                    <p className={styles.badge}>
                        <Trophy size={14} /> Aluno · Turma {entrySemester || 'Semestre indisponível'}
                    </p>
                </div>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={16} /> Sair
                </button>
            </div>

            {/* Statistics Grid */}
            <div className={styles.statsGrid}>
                {/* Theoretical Progress */}
                <div className={styles.statCard}>
                    <p className={styles.statTitle}>Aulas teóricas</p>
                    <p className={styles.statValue}>{theoryDone}/{theoryTotal}</p>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${theoryPct}%` }} />
                    </div>
                    <p className={styles.statPct}>{theoryPct}% concluído</p>
                </div>

                {/* Practical Progress */}
                <div className={styles.statCard}>
                    <p className={styles.statTitle}>Projeto prático</p>
                    <p className={styles.statValue}>{videoDone}/{videoTotal}</p>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${videoPct}%` }} />
                    </div>
                    <p className={styles.statPct}>{videoPct}% concluído</p>
                </div>
            </div>
        </div>
    );
}
