<script lang="ts">
    import { fly } from "svelte/transition";
    import Footer from "../components/Footer.svelte";
    import HeaderFrontpage from "../components/HeaderFrontpage.svelte";
    import { onMount } from "svelte";

    let fadeIn = false;

    onMount(() => {
        fadeIn = true;
    });
</script>

<svelte:head>
    <title>Realms Hub</title>
</svelte:head>

<HeaderFrontpage />

<div class="hero fp-content" id="home">
    <div class="hero-inner">
        {#if fadeIn}
            <img
                class="hero-image"
                src="/images/full-logo.png"
                alt="Realms Hub Logo"
                transition:fly={{ y: -50, duration: 1000 }}
            />
            <span
                class="hero-buttons"
                transition:fly={{ y: 25, duration: 500, delay: 1000 }}
            >
                <a class="fake-button hero-button" href="#about"
                    >Learn More</a
                >
                <a class="fake-button hero-button" href="/login"
                    >Sign in</a
                >
            </span>
        {/if}
    </div>
</div>

<div class="fp-content" id="about">
    <h1><span class="highlight">Realms Hub</span> is the easy way manage your Realm.</h1>
    <div id="advantages">
        <div class="advantage">
            <div class="advantage-more">
                <img src="/icons/github.svg" alt="GitHub Logo">
                <span class="advantage-info">The entire code of Realms Hub is <a href="https://github.com/plagiatus/RealmsHub" target="_blank" rel="noopener noreferrer">available on GitHub.</a> Feel free to have a look or even contribute.</span>
            </div>
            <span class="advantage-tagline">Open Source</span>
        </div>
        <div class="advantage">
            <div class="advantage-more">
                <img src="/icons/bulb.svg" alt="ease of use icon">
                <span class="advantage-info">Use directly in the <span class="highlight">browser</span> from wherever you are, on whatever device you're on. </span>
            </div>
            <span class="advantage-tagline">Easy To Use</span>
        </div>
        <div class="advantage">
            <div class="advantage-more">
                <img src="/icons/extension.svg" alt="feature rich icon">
                <span class="advantage-info">Realms Hub has features that are missing from the game, such as a <span class="highlight">better map search</span> or <span class="highlight">mass invitations</span>.</span>
            </div>
            <span class="advantage-tagline">Feature Rich</span>
        </div>
    </div>
</div>
<div class="fp-content" id="faq">
    <div class="faq-content">
        <h2>Why Realms Hub?</h2>
        <p>Because.</p>
    </div>
</div>
<div class="fp-content" id="contact">
    <h2>Contact</h2>
</div>

<Footer />

<style>
    .hero {
        width: 100%;
        height: calc(100vh - 3em);
        display: grid;
        place-items: center;
    }

    .hero-inner {
        max-width: 1980px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .hero-image {
        max-height: 70vh;
    }

    .hero-buttons {
        font-size: 3em;
    }

    #about,
    #contact {
        padding-top: 3em;
    }
    
    h2 {
        font-size: 2em;
    }

    .fp-content {
        padding: 1em;
        text-align: center;
    }
    .fp-content:nth-of-type(2n + 1) {
        background-color: var(--background);
        color: var(--text-on-dark);
    }

    a.hero-button {
        margin: 0.5em;
        transition: transform 0.3s ease;
    }

    a.hero-button:hover {
        transform: translateY(-0.3em);
    }

    h1 {
        font-size: 3em;
        line-height: 1.5;
        padding: 0 5em;
        margin-bottom: 1em;
    }

    #advantages {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .advantage {
        padding: 1em;
        border: 0.15em solid;
        font-size: 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.3s ease;
        width: 10em;
        height: 10em;
        justify-content: space-between;
    }

    .advantage-more {
        display: block;
        position: relative;
        height: 6em;
        width: 6em;
        margin-bottom: 0.5em;
    }

    .advantage-more > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .advantage-more > img {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .advantage:hover img {
        opacity: 0;
        transform: rotateY(-90deg);
    }

    .advantage-info {
        opacity: 0;
        transform: rotateY(90deg);
        transition: transform 0.3s ease, opacity 0.3s ease;
        font-size: 0.6em;
        line-height: 1.5;
    }
    .advantage:hover .advantage-info {
        opacity: 1;
        transform: none;
    }
</style>
