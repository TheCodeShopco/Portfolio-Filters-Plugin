function initialisePortfolioFilters() {

    function findPortfolioSection() {
        let targetBlock = document.querySelector('#filtered-portfolio-section');
        if (targetBlock) {
            let portfolioSection = targetBlock.closest('section').nextElementSibling;
            return portfolioSection;
        }
    }

    function addFilterComponents(portfolioSection) {
        let targetBlock = document.querySelector('#filtered-portfolio-section');
        if (targetBlock) {
            let filterWrapper = document.createElement('div');
            filterWrapper.id = 'portfolio-section-filter-wrapper';
            filterWrapper.classList.add('sqs-block-form');
            if (targetBlock.getAttribute('data-search-enabled') === 'true') {
                // Creating the search bar and adding its classes/event listener
                let searchBar = document.createElement('input');
                searchBar.type = 'text';
                searchBar.placeholder = 'Search items...';
                searchBar.id = 'portfolio-section-search-bar';
                searchBar.addEventListener('input', filterPortfolioSection);
                // Creating the search bar wrapper and adding its classes and id
                let searchBarWrapper = document.createElement('div');
                searchBarWrapper.id = "portfolio-section-filters-search-bar-wrapper";
                searchBarWrapper.classList.add('form-item', 'field', 'text');
                // Adding the search bar to the wrapper
                searchBarWrapper.appendChild(searchBar);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects');
                formStylings.innerHTML = '<span class="form-input-effects-border"></span>';
                // Adding the form styling to the search bar wrapper
                searchBarWrapper.appendChild(formStylings);
                // Adding the search bar wrapper to the filter wrapper
                filterWrapper.appendChild(searchBarWrapper);
            }
            // Adding the category select bar if it is enabled
            if (targetBlock.getAttribute('data-categories-enabled') === 'true') {
                // Creating the categories select bar and adding its classes/event listener
                let selectBar = document.createElement('select');
                selectBar.id = 'portfolio-section-select-bar';
                selectBar.addEventListener('change', filterPortfolioSection);
                // Creating the default option for the select bar
                let defaultOption = document.createElement('option');
                defaultOption.value = 'all';
                defaultOption.innerText = 'All Categories';
                selectBar.appendChild(defaultOption);
                // Creating the category select wrapper and adding its classes and id
                let categoriesWrapper = document.createElement('div');
                categoriesWrapper.id = "portfolio-section-filters-categories-wrapper";
                categoriesWrapper.classList.add('form-item', 'field', 'select');
                // Adding the category select inner to the category select wrapper
                categoriesWrapper.appendChild(selectBar);
                // Creating the dropdown icon and adding it to the category select wrapper
                let dropdownIcon = document.createElement('div');
                dropdownIcon.classList.add('select-dropdown-icon');
                dropdownIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.439453 1.49825L1.56057 0.501709L9.00001 8.87108L16.4395 0.501709L17.5606 1.49825L9.00001 11.1289L0.439453 1.49825Z"></path></svg>';
                categoriesWrapper.appendChild(dropdownIcon);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects');
                formStylings.innerHTML = '<span class="form-input-effects-border"></span>';
                // Adding the form styling to the category select wrapper
                categoriesWrapper.appendChild(formStylings);
                // Adding the category select wrapper to the filter wrapper
                filterWrapper.appendChild(categoriesWrapper);
            }

            // Adding the inset class if required
            portfolioSection.querySelector('.content').insertBefore(filterWrapper, portfolioSection.querySelector('.content').firstChild);
            if (document.body.classList.contains('tweak-portfolio-grid-basic-width-inset')) {
                filterWrapper.classList.add('inset');
            }

            if (document.body.classList.contains('tweak-portfolio-grid-basic-height-medium')) {
                filterWrapper.style.paddingTop = "6.6vw";
            } else if (document.body.classList.contains('tweak-portfolio-grid-basic-height-small')) {
                filterWrapper.style.paddingTop = "3.3vw";
            } else if (document.body.classList.contains('tweak-portfolio-grid-basic-height-large')) {
                filterWrapper.style.paddingTop = "10vw";
            } else if (document.body.classList.contains('tweak-portfolio-grid-basic-height-custom')) {
                let paddingFinderOuter = document.createElement('div');
                paddingFinderOuter.classList.add('tweak-portfolio-grid-basic-height-custom');
                let paddingFinder = document.createElement('div');
                paddingFinder.classList.add('portfolio-grid-basic');
                paddingFinderOuter.appendChild(paddingFinder);
                let topPadding = window.getComputedStyle(paddingFinder).getPropertyValue('padding-top');
                filterWrapper.style.paddingTop = topPadding;
            }

            // Aligning the components depending on user selection
            let alignment = targetBlock.getAttribute('data-horizontal-alignment');
            switch (alignment) {
                case 'center': {
                    filterWrapper.style.justifyContent = 'center';
                    break;
                }
                case 'right': {
                    filterWrapper.style.justifyContent = 'flex-end';
                    break;
                }
                case 'left': {
                    filterWrapper.style.justifyContent = 'flex-start';
                }
            }
            let spacing = targetBlock.getAttribute('data-bottom-margin');
            filterWrapper.style.marginBottom = spacing;
        }
    }

    function findCategories(portfolioSection) {
        let grid = portfolioSection.querySelector('#gridThumbs');
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
                category = category.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                item.setAttribute('data-category', category);
                categories.add(category);
            }
        }

        let uniqueCategories = Array.from(categories);
        return uniqueCategories;
    }

    // Helper function to add the categories to the select bar

    function addCategoryOptions(categories) {
        let selectBar = document.querySelector('#portfolio-section-select-bar');
        if (!selectBar) return;
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category;
            option.innerText = category;
            selectBar.appendChild(option);
        });
    }

    function filterPortfolioSection() {
        let portfolioSection = findPortfolioSection();
        let searchBar = document.querySelector('#portfolio-section-search-bar');
        let selectBar = document.querySelector('#portfolio-section-select-bar');

        // Finding the values of the search and category bars
        let searchQuery = searchBar ? searchBar.value.toLowerCase() : '';
        let categoryQuery = selectBar ? selectBar.value : 'all';

        let portfolioItems = portfolioSection.querySelectorAll('.grid-item');

        // Iterating over the list items and hiding them if they dont match the search criteria
        portfolioItems.forEach(item => {
            let itemName = item.querySelector('.portfolio-title').innerText.toLowerCase();
            let itemCategory = item.getAttribute('data-category');

            // Check if the search query matches the name, description, or any category
            const matchesSearch = searchBar ? (
            itemName.includes(searchQuery) ||
            itemCategory.toLowerCase().includes(searchQuery)
            ) : true;

            // Check if the item matches the selected category
            const matchesCategory = selectBar ? (categoryQuery === 'all' || itemCategory === categoryQuery) : true;

            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('hidden');
            }, 250);
            
            setTimeout(() => {
                if (matchesSearch && matchesCategory) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 10);
                }
            }, 250);
        });
    }

    let portfolioSection = findPortfolioSection();
    let categories = findCategories(portfolioSection);
    addFilterComponents(portfolioSection);
    addCategoryOptions(categories);
    
}

document.addEventListener('DOMContentLoaded', initialisePortfolioFilters);