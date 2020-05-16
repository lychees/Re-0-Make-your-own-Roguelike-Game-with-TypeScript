import $ from "jquery";
import io from "socket.io-client";

const PORT = 3000;

export class Chat {
    private socket: typeof io.Socket;

    private userCount: JQuery<HTMLElement>;
    private messages: JQuery<HTMLElement>;
    private inputMessage: JQuery<HTMLElement>;

    private username: string;

    initialize() {
        this.socket = io("http://localhost:" + PORT);

        $("#chat-area").hide();

        $("#chat-button").click(() => {
            $("#chat-content").toggle();
        });
        $("#chat-start-button").click(() => {
            $("#chat-init").hide();
            this.join(<string>$("#chat-name").val());
            $("#chat-area").show();
        });

        this.userCount = $("#chat-user-count");
        this.messages = $("#chat-messages");
        this.inputMessage = $("#inputMessage");

        this.inputMessage.keypress(event => {
            if (event.which !== 13) return;

            this.sendMessage();
        });

        this.socket.once("login", ({ userCount }) => {
            this.setParticipantsMessage(userCount);
        });
        this.socket.on('user joined', ({ username, userCount }) => {
            this.setParticipantsMessage(userCount);
            this.log(username + ' joined');
        });

        this.socket.on('user left', ({ username, userCount }) => {
            this.setParticipantsMessage(userCount);
            this.log(username + ' left');
        });

        this.socket.on("new message", ({ username, message }) => {
            this.addChatMessage(username, message);
        });
    }

    private join(username: string) {
        this.username = username;

        this.socket.emit("add user", username);
    }

    private log(message: string) {
        const element = $("<li>").addClass("log").text(message);

        this.addElement(element);
    }
    private addElement(element: JQuery<HTMLElement>) {
        this.messages.append(element);

        this.messages[0].scrollTop = this.messages[0].scrollHeight;
    }

    private setParticipantsMessage(userCount: number) {
        const message = userCount === 1 ? "there's 1 participant" : "there are " + userCount + " participants";

        this.userCount.text(message);
    }
    private addChatMessage(username: string, message: string) {
        const messageDiv = $("<li class='message' />")
            .append(
                $("<span class='username' />").text(username),
                $("<span class='message-body' />").text(message),
            );

        this.addElement(messageDiv);
    }

    private sendMessage() {
        const message = <string>this.inputMessage.val();
        this.inputMessage.val("");

        this.addChatMessage(this.username, message);

        this.socket.emit("new message", message);
    }
}
