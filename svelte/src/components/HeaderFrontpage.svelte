<script lang="ts">
    import LoginIcon from "$lib/assets/icons/login.svg";
    import Logo from "$lib/assets/images/logo.png";
</script>

<header>
    <a href="#home">
        <img class="logo" src={Logo} alt="Logo" />
    </a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
    <span />

    <a href="#home" class="login">
        <img src={LoginIcon} class="icon" alt="Login" />
    </a>
</header>

<style>
    header {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        width: 100%;
        background-color: var(--background-dark);
        color: var(--text-on-dark);
        padding: 0;
        height: 3em;
        display: grid;
        grid-template-columns: auto auto auto 1fr auto;
    }

    a {
        text-decoration: none;
        display: inline-block;
        color: inherit;
        padding: 1em;
        height: 3em;
    }
    a:hover {
        background-color: var(--background-dark-light);
    }

    img.logo {
        max-height: 3em;
    }
    img.icon {
        width: 2em;
        height: 2em;
    }

    a.login {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    a[href="#home"] {
        padding: 0;
    }
</style>
