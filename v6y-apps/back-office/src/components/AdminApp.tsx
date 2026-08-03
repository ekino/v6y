'use client';

import { CoreAdminContext } from 'ra-core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { authProvider } from '../core/providers/authProvider.ts';
import { dataProvider } from '../core/providers/dataProvider.ts';
import { resources } from '../core/resources/index.ts';
import AdminLayout from './AdminLayout.tsx';
import RequireAuth from './RequireAuth.tsx';
import ResourceForm from './ResourceForm.tsx';
import ResourceList from './ResourceList.tsx';
import ResourceShow from './ResourceShow.tsx';

export default function AdminApp() {
    return (
        <BrowserRouter basename="/admin">
            <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
                <RequireAuth>
                    <AdminLayout>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to={`/${resources[0].name}`} replace />}
                            />
                            {resources.map((resource) => (
                                <Route key={resource.name} path={`/${resource.name}`}>
                                    <Route index element={<ResourceList resource={resource} />} />
                                    {resource.canCreate && (
                                        <Route
                                            path="create"
                                            element={
                                                <ResourceForm resource={resource} mode="create" />
                                            }
                                        />
                                    )}
                                    <Route
                                        path=":id"
                                        element={<ResourceForm resource={resource} mode="edit" />}
                                    />
                                    <Route
                                        path=":id/show"
                                        element={<ResourceShow resource={resource} />}
                                    />
                                </Route>
                            ))}
                        </Routes>
                    </AdminLayout>
                </RequireAuth>
            </CoreAdminContext>
        </BrowserRouter>
    );
}
