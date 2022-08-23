import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { nugetSearchPlugin, NugetSearchPage } from '../src/plugin';

createDevApp()
  .registerPlugin(nugetSearchPlugin)
  .addPage({
    element: <NugetSearchPage />,
    title: 'Root Page',
    path: '/nuget-search'
  })
  .render();
