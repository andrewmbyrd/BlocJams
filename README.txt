## Bloc Jams

This project allows you to play songs through your browser!

![Image of Many albums in the browser](http://i.imgur.com/DeT7BD1.png)

## Configuration

First, use the command line to change directory (cd) into the desired directory. You may want to create a new directory for the entire project.

Next, clone [this repository](https://github.com/andrewmbyrd/BlocJams.git) into your desired directory with a `git clone` command.

In the directory you just cloned, there should be a `assets/music` folder. Place whatever song files (`.mp3`, `.aac`, `.wav, etc.) you want the app to be able to play in there!

Now, to actually have it added as a song you can see in the player, you need to include it in an album. The easiest way to do this is to just go into `scripts/Fixtures.js` In the first album variable, in the `songs` array, add the information about your newly-added songs.

![how to add songs](http://i.imgur.com/vTjKyTo.png)

Note: where it says `YOUR FILE NAME`, you may need to append the file type (e.g. your_file_name*.mp3*)

I could have made this process simpler, but hey! It was my first project!
 