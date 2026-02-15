'use client';

import {
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { getAdminDashboard } from '@/lib/api';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  LoadingScreen,
  Alert,
} from '@/components/ui';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Mail,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AdminUser } from '@/types';

export default function AdminPage() {
  const {
    user,
  } =
    useAuthStore();
  const router =
    useRouter();
  const [
    users,
    setUsers,
  ] =
    useState<
      AdminUser[]
    >(
      []
    );
  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      true
    );
  const [
    error,
    setError,
  ] =
    useState<
      | string
      | null
    >(
      null
    );

  useEffect(() => {
    if (
      user &&
      user.role !==
        'admin'
    ) {
      router.push(
        '/dashboard'
      );
      return;
    }

    const fetchUsers =
      async () => {
        try {
          const response =
            await getAdminDashboard();
          setUsers(
            response.users
          );
        } catch (err: any) {
          setError(
            err
              .response
              ?.data
              ?.message ||
              'Failed to load users'
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };

    fetchUsers();
  }, [
    user,
    router,
  ]);

  if (
    isLoading
  ) {
    return (
      <LoadingScreen message="Loading admin dashboard..." />
    );
  }

  const stats =
    [
      {
        name: 'Total Users',
        value:
          users.length,
        icon: Users,
        color:
          'text-blue-600',
        bgColor:
          'bg-blue-100',
      },
      {
        name: 'Verified Users',
        value:
          users.filter(
            (
              u
            ) =>
              u.isEmailVerified
          )
            .length,
        icon: UserCheck,
        color:
          'text-green-600',
        bgColor:
          'bg-green-100',
      },
      {
        name: 'Unverified Users',
        value:
          users.filter(
            (
              u
            ) =>
              !u.isEmailVerified
          )
            .length,
        icon: UserX,
        color:
          'text-yellow-600',
        bgColor:
          'bg-yellow-100',
      },
      {
        name: 'Admins',
        value:
          users.filter(
            (
              u
            ) =>
              u.role ===
              'admin'
          )
            .length,
        icon: Shield,
        color:
          'text-purple-600',
        bgColor:
          'bg-purple-100',
      },
    ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage
            users
            and
            view
            system
            statistics
          </p>
        </div>

        {error && (
          <Alert
            variant="error"
            onClose={() =>
              setError(
                null
              )
            }
          >
            {
              error
            }
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(
            (
              stat
            ) => (
              <Card
                key={
                  stat.name
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${stat.bgColor}`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${stat.color}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {
                          stat.name
                        }
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          stat.value
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              All
              Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(
                    (
                      user
                    ) => (
                      <tr
                        key={
                          user.id
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={
                                user.name ||
                                user.email
                              }
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name ||
                                  'No name'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {
                                  user.email
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.isEmailVerified
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {user.isEmailVerified
                              ? 'Verified'
                              : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.role ===
                              'admin'
                                ? 'info'
                                : 'default'
                            }
                          >
                            {
                              user.role
                            }
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(
                            user.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            {users.length ===
              0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No
                  users
                  found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
