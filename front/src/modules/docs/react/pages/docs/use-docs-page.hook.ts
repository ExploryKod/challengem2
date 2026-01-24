import { useState, useEffect, useCallback } from 'react';
import { DocsDomainModel } from '@taotask/modules/docs/core/model/docs.domain-model';

export const useDocsPage = () => {
  const [activeSection, setActiveSection] =
    useState<DocsDomainModel.SectionId>('commande-web');

  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId as DocsDomainModel.SectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as DocsDomainModel.SectionId);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    DocsDomainModel.SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return {
    sections: DocsDomainModel.SECTIONS,
    activeSection,
    handleSectionClick,
  };
};
