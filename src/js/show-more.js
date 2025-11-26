(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const projectCards = document.querySelectorAll('.project-card');
        const showMoreContainer = document.getElementById('showMoreContainer');
        const showMoreBtn = document.getElementById('showMoreBtn');
        const showMoreText = showMoreBtn ? showMoreBtn.querySelector('.show-more-text') : null;

        const INITIAL_VISIBLE_COUNT = 3;

        if (showMoreContainer) {
            showMoreContainer.style.display = 'none';
        }
        let isExpanded = false;

        if (projectCards.length > INITIAL_VISIBLE_COUNT) {
            projectCards.forEach((card, index) => {
                if (index >= INITIAL_VISIBLE_COUNT) {
                    card.classList.add('hidden-project');
                }
            });

            if (showMoreContainer) {
                showMoreContainer.style.display = 'flex';
            }

            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', function (e) {
                    e.preventDefault(); 
                    isExpanded = !isExpanded;

                    if (isExpanded) {
                        projectCards.forEach((card, index) => {
                            if (index >= INITIAL_VISIBLE_COUNT) {
                                card.classList.remove('hidden-project');
                                card.classList.add('show-project');
                            }
                        });

                        if (showMoreText) {
                            showMoreText.textContent = 'Show Less Projects';
                        }
                        showMoreBtn.classList.add('expanded');

                        setTimeout(() => {
                            const firstHiddenProject = projectCards[INITIAL_VISIBLE_COUNT];
                            if (firstHiddenProject) {
                                const offset = 100; 
                                const elementPosition = firstHiddenProject.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - offset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                    } else {
                        projectCards.forEach((card, index) => {
                            if (index >= INITIAL_VISIBLE_COUNT) {
                                card.classList.add('hidden-project');
                                card.classList.remove('show-project');
                            }
                        });

                        if (showMoreText) {
                            showMoreText.textContent = 'Show More Projects';
                        }
                        showMoreBtn.classList.remove('expanded');

                        const projectsSection = document.getElementById('projects');
                        if (projectsSection) {
                            const offset = 100;
                            const elementPosition = projectsSection.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            }
        }
        else {
            if (showMoreContainer) {
                showMoreContainer.style.display = 'none';
            }
        }
    });
})();
