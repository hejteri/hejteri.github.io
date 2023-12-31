function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Set a random horizontal position for each particle
            const randomX = Math.random() * window.innerWidth;
            particle.style.left = `${randomX}px`;

            // Append the particle to the particles container
            document.getElementById('particles-container').appendChild(particle);

            // Remove the particle after animation completes
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
