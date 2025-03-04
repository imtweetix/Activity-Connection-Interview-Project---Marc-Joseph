/* Activity Connection Interview Project */

(async () => {
  // Fetch the content map from the static URL.
  const url = 'https://interview.actcon.info/static/content_map.json';
  const contentMapResponse = await fetch(url);

  // Parse the JSON response.
  const contentMap = await contentMapResponse.json();

  // A CSS string that defines the styles for tooltips and the toggle to enable them.
  const tooltipStyles = `
        a.nav-link--level-3 {
            position: relative;
        }
        .custom-tooltip {
            position: absolute;
            background: #103B7E; /* Dark Cornflower */
            color: #fff;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: .75rem;
            text-wrap: balance;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
            width: 100%;
        }
        .tooltip-toggle-container {
            position: absolute;
            right: 30px;
            color: #1a0d3f; /* Royal Abyss */
            font-size: .75rem;
            cursor: pointer;
        }
        .tooltip-toggle-container label {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tooltip-toggle-container input {
            cursor: pointer;
            accent-color: #1A5CC7; /* Denim */
        }
    `;

  // Inject styles into the page.
  const styleTag = document.createElement('style');
  styleTag.innerHTML = tooltipStyles;
  document.head.appendChild(styleTag);

  /**
   * Fetches a description for a given menu title from the content map.
   * @param {string} menuTitle - The title of the menu item to fetch the description for.
   * @returns {string|null} The description for the menu title, or `null` if not found.
   */
  function getDescription(menuTitle) {
    const item = contentMap.find((entry) => entry.title === menuTitle);
    return item ? item.description : null;
  }

  // Attach tooltips to nav links with descriptions from the content map.
  function attachTooltipsToNavLinks() {
    const navLinks = document.querySelectorAll('a.nav-link--level-3');

    navLinks.forEach((link) => {
      const description = getDescription(link.dataset.text);

      if (!description) return;

      // Create a tooltip element.
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.innerText = description;
      link.appendChild(tooltip);

      // Position tooltip above the nav links.
      function positionTooltip() {
        tooltip.style.top = `-${tooltip.offsetHeight + 5}px`;
        tooltip.style.left = '0px';
        tooltip.style.opacity = '1';
      }

      // Show tooltip on hover.
      ['mouseenter', 'focus'].forEach((event) => {
        link.addEventListener(event, () => {
          if (!tooltipsEnabled) return;
          positionTooltip();
        });
      });

      // Hide tooltip on blur.
      ['mouseleave', 'blur'].forEach((event) => {
        link.addEventListener(event, () => {
          if (!tooltipsEnabled) return;
          tooltip.style.opacity = 0;
        });
      });
    });
  }

  // Check if tooltips are enabled.
  let tooltipsEnabled = localStorage.getItem('tooltipsEnabled') === 'true';

  /**
   * Create a global toggle element that can be inserted into the page.
   * This toggle controls the visibility of all tooltips.
   * @returns {HTMLElement} The toggle container element.
   */
  function createGlobalToggle() {
    // Create a container for the toggle.
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'tooltip-toggle-container';

    // Create a checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tooltipsEnabled;

    // Update the tooltipsEnabled variable and save it to local storage when the checkbox is changed.
    checkbox.addEventListener('change', () => {
      tooltipsEnabled = checkbox.checked;
      localStorage.setItem('tooltipsEnabled', tooltipsEnabled);

      // Sync all toggles (if multiple exist).
      document
        .querySelectorAll('.tooltip-toggle-container input')
        .forEach((input) => {
          input.checked = tooltipsEnabled;
        });
    });

    // Create a label for the checkbox.
    const label = document.createElement('label');
    label.textContent = 'Enable Tooltips';

    // Append the checkbox and label to the toggle container.
    toggleContainer.appendChild(label);
    label.appendChild(checkbox);
    return toggleContainer;
  }

  // Inserts the global tooltip toggle into each flyout panel.
  function insertToggleInFlyoutPanels() {
    const menuProgramElements = document.querySelectorAll('.menu-programs');

    if (menuProgramElements.length === 0) return;

    // Iterate over the menu programs elements and insert the toggle.
    menuProgramElements.forEach((menuProgramElement) => {
      const firstChildElement = menuProgramElement.firstElementChild;

      if (!menuProgramElement.querySelector('.tooltip-toggle-container')) {
        // Insert the toggle into the first child element.
        firstChildElement.appendChild(createGlobalToggle());
      }
    });
  }

  // Close the flyout panel when the close button is clicked.
  const closeButtons = document.querySelectorAll('.nav-back-button');
  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const flyoutPanel = event.currentTarget.closest('.nav-submenu.level-2');

      if (flyoutPanel) {
        //Hide the flyout panel.
        flyoutPanel.classList.remove('show');
      }
    });
  });

  // Initialize everything.
  function init() {
    insertToggleInFlyoutPanels();
    attachTooltipsToNavLinks();
  }

  init();
})();
