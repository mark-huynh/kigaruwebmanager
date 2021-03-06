<h2>*This project is now deprecated</h2>

Backend has shifted to serverless AWS. New [management repo](https://github.com/mark-huynh/kigaru-manager).

**This version of Electron only works on Window OS (will incorporate Mac OS if business uses a new computer)

**See kigaru-web-manager-prod for production app with .exe**

This manager will allow authenticated users to be able to update the Kigaru Website (kigaru-sushi.com). This manager utilizes python scripts that will update menu items using text-parsers and git commands, allowing the entire website to run without a backend.

Upon clone ensure you have installed:

- Git
- Nodejs
- Python


Run:

```
npm run package-win
```

and set up git credentials through:

```$ git config credential.helper store
$ git push https://github.com/owner/repo.git

Username for 'https://github.com': <USERNAME>
Password for 'https://USERNAME@github.com': <PASSWORD>
```

as well as

```
  git config --global user.email "you@example.com" 
  git config --global user.name "Your Name"
```

Move Python manipulation files into the kigaruweb folder after clicking grab files

NOTE:: This management system was developed with the knowledge that these files were not going to go into prod at a large scale. As a result, best practices and efficient techniques were not entirely utilized as a result of the time it takes to refactor existing code along with the constricted deadline of Summer 2019. Because this management system is being used at a single restaurant with relatively few updates perceived in the future, it was deemed that code analysis and cleanup was not necessary at the moment. I am fully aware that lots of code generalizations, refactoring, and different implementations, as well as techniques to avoid call-back hell could have been incorporated. However, this was my first time attempting to use Electron and focus was shifted on learning the platform than working on the intricacies of Javascript, CSS, and HTML. Thanks for checking out my repo! 
