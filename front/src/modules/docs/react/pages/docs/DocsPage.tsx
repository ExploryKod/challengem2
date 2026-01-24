'use client';

import React from 'react';
import { DocsLayout } from '../../layouts/DocsLayout';
import { DocsSidebar } from '../../components/sidebar/DocsSidebar';
import { OverviewSection } from '../../sections/overview/OverviewSection';
import { WebOrderSection } from '../../sections/web-order/WebOrderSection';
import { TerminalOrderSection } from '../../sections/terminal-order/TerminalOrderSection';
import { QrOrderSection } from '../../sections/qr-order/QrOrderSection';
import { BackofficeSection } from '../../sections/backoffice/BackofficeSection';
import { KitchenAppSection } from '../../sections/kitchen-app/KitchenAppSection';
import { useDocsPage } from './use-docs-page.hook';

export const DocsPage: React.FC = () => {
  const { activeSection, handleSectionClick } = useDocsPage();

  return (
    <DocsLayout
      sidebar={
        <DocsSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      }
    >
      <div className="space-y-16">
        <OverviewSection />
        <WebOrderSection />
        <TerminalOrderSection />
        <QrOrderSection />
        <BackofficeSection />
        <KitchenAppSection />
      </div>
    </DocsLayout>
  );
};
