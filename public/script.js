// Login
const ACCESS_CODE = "Iiasaoncinoten_eltnii_C";

let term = null;
let socket = null;

// Form Submit
document
.getElementById("loginForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    checkAccess();

});

// Enter Key
document
.getElementById("accessCode")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        e.preventDefault();
        checkAccess();
    }

});

// Password Toggle 
document
.getElementById("passwordToggle")
.addEventListener("click", function(){

    const input =
        document.getElementById("accessCode");

    input.type =
        input.type === "password"
        ? "text"
        : "password";

});

// Access Check
function checkAccess(){

    const entered =
        document.getElementById("accessCode")
        .value
        .trim();

    const error =
        document.getElementById("error");

    error.textContent = "";

    if(entered !== ACCESS_CODE){

        error.textContent =
            "Invalid_access_code hint=Rail_Fence_10_Button_Text dencode.com";

        return;
    }

    document.getElementById("successMessage")
        .style.display = "block";

    setTimeout(() => {

        document.getElementById("loginContainer")
            .style.display = "none";

        document.getElementById("terminalContainer")
            .style.display = "block";

        startTerminal();

    }, 1000);
}

// Terminal 
function startTerminal(){

    term = new Terminal({
        cursorBlink: false,
        disableStdin: true,
        cols: 120,
        rows: 30
    });

    term.open(
        document.getElementById("terminal")
    );

    term.clear();

    if(typeof io !== "undefined"){

        socket = io({
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000
        });

        socket.on("terminal-output", data => {

            term.write(data);

        });

    } else {

        term.writeln("");
        term.writeln("Socket.IO not available.");
    }
}


// Neon Cyber Login Form JavaScript
class NeonCyberLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm'); 
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.neon-button');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.social-matrix');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupCyberEffects();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e)); 
        this.passwordInput.addEventListener('blur', () => this.validatePassword()); 
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // Add placeholder for label animations 
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            this.passwordToggle.classList.toggle('toggle-active', type === 'text');
            
            // Add cyber effect
            this.triggerCyberGlitch(this.passwordToggle);
        });
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = button.querySelector('span').textContent.trim();
                this.handleSocialLogin(provider, button);
            });
        });
    }
    
    setupCyberEffects() {
        // Add cyber scanning effects on input focus
        [this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                this.triggerCyberScan(e.target.closest('.cyber-field'));
            });
            
            input.addEventListener('blur', (e) => {
                this.stopCyberScan(e.target.closest('.cyber-field'));
            });
        });
        
        // Add random glitch effects
        this.startRandomGlitches();
    }
    
    triggerCyberScan(field) {
        // Activate scanning animation
        const scanner = field.querySelector('.cyber-scanner');
        scanner.style.opacity = '1';
    }
    
    stopCyberScan(field) {
        // Deactivate scanning animation
        const scanner = field.querySelector('.cyber-scanner');
        scanner.style.opacity = '0.3';
    }
    
    triggerCyberGlitch(element) {
        // Add temporary glitch effect
        element.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            element.style.filter = '';
        }, 200);
    }
    
    startRandomGlitches() {
        // Add random glitch effects to title
        setInterval(() => {
            const titleGlitch = document.querySelector('.title-glitch');
            if (Math.random() < 0.1) { // 10% chance every interval
                titleGlitch.style.animation = 'none';
                titleGlitch.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                titleGlitch.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                
                setTimeout(() => {
                    titleGlitch.style.animation = '';
                    titleGlitch.style.transform = '';
                    titleGlitch.style.filter = '';
                }, 100);
            }
        }, 2000);
    }
    
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', '[ ERROR: ACCESS_CODE_REQUIRED ]');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', '[ ERROR: CODE_TOO_SHORT ]');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const cyberField = document.getElementById(field).closest('.cyber-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        cyberField.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add error glitch effect
        this.triggerCyberGlitch(cyberField);
    }
    
    clearError(field) {
        const cyberField = document.getElementById(field).closest('.cyber-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        cyberField.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
         
        const isPasswordValid = this.validatePassword();
        
        if (!isPasswordValid) {
            // Add system error glitch
            this.triggerSystemGlitch();
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Simulate cyber authentication process
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Show matrix success
            this.showMatrixSuccess();
        } catch (error) {
            this.showError('password', '[ ERROR: CONNECTION_FAILED ]');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(provider, button) {
        console.log(`[ CONNECTING TO ${provider.toUpperCase()}_PROTOCOL ]`);
        
        // Cyber loading state
        const originalHTML = button.innerHTML;
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        
        const loadingHTML = `
            <div class="social-frame"></div>
            <div style="display: flex; gap: 2px;">
                <div style="width: 2px; height: 12px; background: #00ff41; animation: matrixPulse 1.2s ease-in-out infinite;"></div>
                <div style="width: 2px; height: 12px; background: #00ff41; animation: matrixPulse 1.2s ease-in-out infinite; animation-delay: 0.1s;"></div>
                <div style="width: 2px; height: 12px; background: #00ff41; animation: matrixPulse 1.2s ease-in-out infinite; animation-delay: 0.2s;"></div>
                <div style="width: 2px; height: 12px; background: #00ff41; animation: matrixPulse 1.2s ease-in-out infinite; animation-delay: 0.3s;"></div>
            </div>
            <span>CONNECTING...</span>
            <div class="social-glow"></div>
        `;
        
        button.innerHTML = loadingHTML;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2500));
            console.log(`[ REDIRECTING TO ${provider.toUpperCase()}_MATRIX ]`);
            // window.location.href = `/auth/${provider.toLowerCase().replace('_', '-')}`;
        } catch (error) {
            console.error(`[ ${provider.toUpperCase()}_CONNECTION_ERROR: ${error.message} ]`);
        } finally {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.innerHTML = originalHTML;
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        
        // Disable social buttons during matrix processing
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.5' : '1';
        });
        
        if (loading) {
            // Add loading glitch effects
            this.startLoadingGlitches();
        }
    }
    
    startLoadingGlitches() {
        // Add periodic glitches during loading
        const glitchInterval = setInterval(() => {
            if (!this.submitButton.classList.contains('loading')) {
                clearInterval(glitchInterval);
                return;
            }
            
            const terminal = document.querySelector('.cyber-terminal');
            terminal.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                terminal.style.filter = '';
            }, 50);
        }, 500);
    }
    
    triggerSystemGlitch() {
        // System-wide glitch effect for errors
        const terminal = document.querySelector('.cyber-terminal');
        terminal.style.animation = 'none';
        terminal.style.transform = 'translate(2px, -1px)';
        terminal.style.filter = 'hue-rotate(270deg)';
        
        setTimeout(() => {
            terminal.style.animation = '';
            terminal.style.transform = '';
            terminal.style.filter = '';
        }, 200);
    }
    
    showMatrixSuccess() {
        // Hide form with cyber transition
        this.form.style.transform = 'scale(0.9)';
        this.form.style.opacity = '0';
        this.form.style.filter = 'blur(2px)';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.matrix-social').style.display = 'none';
            document.querySelector('.matrix-signup').style.display = 'none';
            document.querySelector('.cyber-divider').style.display = 'none';
            
            // Show cyber success
            this.successMessage.classList.add('show');
            
            // Add success glitch
            this.triggerSuccessGlitch();
            
        }, 300);
        
        // Redirect after matrix connection established
        setTimeout(() => {
            console.log('[ ACCESS_GRANTED - ENTERING_CYBERSPACE ]');
            // window.location.href = '/cyber-dashboard';
        }, 4000);
    }
    
    triggerSuccessGlitch() {
        // Success glitch effect
        setTimeout(() => {
            const successTitle = document.querySelector('.success-title');
            successTitle.style.animation = 'textGlitch 0.5s ease-in-out';
            
            setTimeout(() => {
                successTitle.style.animation = '';
            }, 500);
        }, 1500);
    }
}

// Initialise the cyber form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeonCyberLoginForm();
});
