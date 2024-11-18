// Function to get the current mode from localStorage
const getStoredMode = () => {
    return localStorage.getItem('mode') || 'light';
  };
  // Function to apply the mode
  const applyMode = (mode) => {
    ui('mode', mode);
    localStorage.setItem('mode', mode);
  
    // Update the checkbox state
    const checkbox = document.querySelector('.switch input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = mode === 'dark';
    }
  };
  // Function called when clicking the checkbox (renamed to toggleMode)
  const toggleMode = () => {
    const newMode = getStoredMode() === 'dark' ? 'light' : 'dark';
    applyMode(newMode);
  };
  // Function to initialize the mode when the page loads
  const initializeMode = () => {
    const storedMode = getStoredMode();
    applyMode(storedMode);
  };
  // Initialize the mode when the DOM is ready
  document.addEventListener('DOMContentLoaded', initializeMode);
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("navbar").style.top = "0";
    } else {
      document.getElementById("navbar").style.top = "-90px";
    }
    prevScrollpos = currentScrollPos;
  }