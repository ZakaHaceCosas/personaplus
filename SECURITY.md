# Security at PersonaPlus

Found a security vulnerability reading code or testing the app? This is what to do.

## Reporting a vulnerability

1. **Do NOT publish** anything about the vulnerability in public places like the Issues tab, Discord server, or anything similar.
2. **Contact the PersonaPlus team** by sending a DM to [Discord](https://discord.gg/wwzddK4Zpc) members with the `@team - security` role. In your message, please include:

   - Description of the vulnerability.
   - Steps to reproduce.
   - Potential impact (AKA what is the real risk of the vulnerability).
   - Optionally, if you know how we could fix it, tell us.

We also recommend that you [submit a report to our repository here](https://github.com/GiveItAPlus/personaplus/security/advisories/new) (replacing the default description with the content described before).
3. If you think you can fix it yourself, **explain us your solution in your message and DO NOT create a pull request whatsoever with your fix.**

We really acknowledge your help and we will try our best to develop a solution ASAP.

We will reply to you with a max delay of 24 hours, and notify you (and everyone else) as soon as we're able to release a patch.

## Again: Do not divulgate vulnerabilities

Drawing attention will only increase chances of someone exploiting the app. We kindly ask you to not tell anyone but us about security issues you find.

## Best security practices

Please follow these practices when submitting code to the project to ensure everything remains safe and sound.

- **Review your code:** Okay, it might seem obvious, but everyone has probably submitted an auth token to production at least once - with this we mean, read your local diff before submitting your code.
- **Keep dependencies up to date:** Run `npm run dep:check` always before pushing your code.
- **Ensure everything is proven to work:** Make sure all tests are passing. If you even write your own tests for your new code (or for old code that wasn't test covered), even better.

Thanks for helping us keeping PersonaPlus safe for everyone!
