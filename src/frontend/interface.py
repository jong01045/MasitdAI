import streamlit as st

# Set the page config (optional)
st.set_page_config(page_title="MasidtAI", page_icon=":muscle:", layout="wide")

# 1. Inject custom CSS for banner & hero section
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
    background-color: #000; /* Entire page background is black */
    color: #ffffff; /* White text */
    margin: 0;
    padding: 0;
}

/* ------------------ TOP BANNER ------------------ */
.top-banner {
    background-color: #333; /* Dark grey background for the banner */
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.banner-logo {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
}

.banner-icons {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.icon-search {
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
}

.login-button {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    /* Increase border-radius for a rounder shape */
    border-radius: 50px; 
    font-size: 1.2rem;
    cursor: pointer;
}
.login-button:hover {
    background-color: #777;
}
            
.icon-user {
    position: relative;
    font-size: 1.2rem;
    cursor: pointer;
    color: #fff;
    z-index: 10; /* Added: ensures user icon is above other elements */
}

.icon-user .tooltip {
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 999; /* Added: ensures tooltip is on top */
}

.icon-user:hover .tooltip {
    visibility: visible;
    opacity: 1;
}

/* ------------------ HERO SECTION ------------------ */
.hero-section {
    background-color: #333; /* Dark grey for the hero pane */
    text-align: center;
    padding: 4rem 2rem;
    margin-bottom: 2rem; /* Creates spacing to show black background below */
}

.hero-section h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-section p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #cccccc; /* Slightly lighter grey for contrast */
}

/* CTA Buttons */
.cta-buttons {
    margin-bottom: 2rem;
}

.cta-button {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    margin: 0 0.5rem;
    cursor: pointer;
    font-size: 1rem;
}
.cta-button:hover {
    background-color: #777;
}

/* Icon Features */
.icon-features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
}

.feature-box {
    background-color: #444;
    border-radius: 0.5rem;
    width: 160px;
    height: 140px;
    padding: 1rem;
    text-align: center;
}

.feature-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}
</style>
""", unsafe_allow_html=True)

# 2. Render the top banner (grey)
top_banner_html = """
<div class="top-banner">
    <div class="banner-logo">MasidtAI</div>
    <div class="banner-icons">
        <div class="icon-search">🔍</div>
        <button class="login-button">Log in</button>
        <!-- Added user icon with a tooltip -->
        <div class="icon-user">
            👤
            <div class="tooltip">Sign in</div>
        </div>
    </div>
</div>
"""
st.markdown(top_banner_html, unsafe_allow_html=True)

# 3. Hero section (grey pane with inspirational text, CTAs, and icons)
hero_html = """
<div class="hero-section">
    <h1>We Train Smart. We Find Top Resources. We Gather Tips from Pros.</h1>
    <p>
        MasidtAI is your ultimate workout recommendation system, powered by advanced LLM.<br>
        Achieve your fitness goals with expert guidance, curated resources, and community support.
    </p>
    <div class="cta-buttons">
        <button class="cta-button">Start Now</button>
        <button class="cta-button">Download App</button>
    </div>
    <div class="icon-features">
        <div class="feature-box">
            <div class="feature-icon">💪</div>
            <p>Personalized Workouts</p>
        </div>
        <div class="feature-box">
            <div class="feature-icon">📚</div>
            <p>Curated Resources</p>
        </div>
        <div class="feature-box">
            <div class="feature-icon">🤝</div>
            <p>Pro Tips & Community</p>
        </div>
    </div>
</div>
"""
st.markdown(hero_html, unsafe_allow_html=True)

# 4. Additional content (black background)
st.write("Below the grey pane, the background is black. You can add more content here.")
