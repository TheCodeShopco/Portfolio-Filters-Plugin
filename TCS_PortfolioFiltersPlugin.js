function initialisePortfolioFilters() {

    function findFilterLocation() {
        let filterBlock = document.getElementById('portfolio-filters');
        if (!filterBlock) {
            let grid = document.querySelector('#gridThumbs');
            if (grid === null) {
                return;
            }
            filterBlock = document.createElement('div');
            filterBlock.id = 'portfolio-filters';
            grid.parentNode.insertBefore(filterBlock, grid);
            filterBlock.classList.add('filters-default');
            grid.classList.add('filters-default-active');
            return filterBlock;
        } else {
            return filterBlock;
        }
    }

    function findPortfolioCategories() {
        let grid = document.querySelector('#gridThumbs');
        if (grid === null) {
            return;
        }
        let portfolioItems = grid.children;
        let categories = new Set();

        for (let item of portfolioItems) {
            item.classList.add('visible');
            let href = item.getAttribute('href');
            if (href) {
                href = href.substring(1).split('/').slice(1).join('/');
                let category = href.split('/')[0];
                categories.add(category);
            }
        }

        let uniqueCategories = Array.from(categories);
        return uniqueCategories;
    }

    function createFilterButtons() {
        let filterBlock = findFilterLocation();
        if (!filterBlock) {
            return; 
        }
        let categories = findPortfolioCategories();

        let filterAll = document.createElement('a');
        filterAll.classList.add('filter-all', 'active');
        filterAll.innerHTML = 'All';
        filterAll.addEventListener('click', () => filterPortfolioItems(filterAll));
        filterBlock.appendChild(filterAll);

        for (let category of categories) {
            let filterLink = document.createElement('a');
            filterLink.classList.add(`filter-${category}`);
            // Replace '-' with ' ' and capitalize the first letter of each word
            let formattedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            filterLink.innerHTML = formattedCategory;
            filterLink.addEventListener('click', () => filterPortfolioItems(filterLink));
            filterBlock.appendChild(filterLink);
        }
    }

    function filterPortfolioItems(element) {
        let filterCategory = element.classList[0].split('-').slice(1).join('-');

        document.querySelectorAll('#portfolio-filters a').forEach(filter => {
            filter.classList.remove('active');
        });
        element.classList.add('active');

        document.querySelectorAll('#gridThumbs a').forEach(item => {

            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('hidden');
            }, 250);

            setTimeout(() => {
                if (filterCategory === 'all' || item.getAttribute('href').includes(filterCategory)) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 10);
                }
            }, 250);

        });
    }

    createFilterButtons();

    function assignCustomStyles() {
        let filterBlock = findFilterLocation();
        if (!filterBlock) {
            return
        }

        if (filterBlock.classList.contains('filters-default')) {
            return;
        }

        let alignment = filterBlock.getAttribute('data-alignment') || 'center';
        let spacing = filterBlock.getAttribute('data-spacing') || '2rem';
        let direction = filterBlock.getAttribute('data-row-or-column') || 'row';

        switch (alignment) {
            case 'center':
                alignment = 'center';
                break;
            case 'left':
                alignment = 'flex-start';
                break;
            case 'right':
                alignment = 'flex-end';
                break;
            default:
                alignment = 'center';
        }

        filterBlock.style.justifyContent = alignment;
        filterBlock.style.gap = spacing;
        filterBlock.style.flexDirection = direction;
    }

    assignCustomStyles();
    
}

document.addEventListener('DOMContentLoaded', initialisePortfolioFilters);