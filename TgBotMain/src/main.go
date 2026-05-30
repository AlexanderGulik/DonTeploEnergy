package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/mymmrac/telego"
	th "github.com/mymmrac/telego/telegohandler"
	tu "github.com/mymmrac/telego/telegoutil"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Ошибка загрузки .env файла")
	}
	ctx := context.Background()
	botToken := os.Getenv("BOT_TOKEN")

	if botToken == "" {
		log.Fatal("BOT_TOKEN не установлен")
	}

	webAppURL := os.Getenv("WEB_APP_URL")
	if webAppURL == "" {
		webAppURL = "http://localhost:3000"
	}
	bot, err := telego.NewBot(botToken, telego.WithDefaultDebugLogger())
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = bot.DeleteWebhook(ctx, &telego.DeleteWebhookParams{
		DropPendingUpdates: false,
	})
	if err != nil {
		log.Printf("Предупреждение: не удалось удалить вебхук: %v", err)
	} else {
		log.Println("Вебхук успешно удален")
	}
	updates, _ := bot.UpdatesViaLongPolling(ctx, nil)

	bh, _ := th.NewBotHandler(bot, updates)

	defer func() { _ = bh.Stop() }()
	//1
	bh.Handle(func(ctx *th.Context, update telego.Update) error {
		webAppButton := tu.InlineKeyboardButton("🌍 Открыть приложение").
			WithWebApp(&telego.WebAppInfo{URL: webAppURL})

		keyboard := tu.InlineKeyboard(tu.InlineKeyboardRow(webAppButton))

		message := tu.Message(
			tu.ID(update.Message.Chat.ID),
			fmt.Sprintf("👋 Привет, %s!\n\nДобро пожаловать в наше приложение! Нажми кнопку ниже чтобы открыть его.", update.Message.From.FirstName),
		).WithReplyMarkup(keyboard)

		_, err := ctx.Bot().SendMessage(ctx, message)
		return err
	}, th.CommandEqual("start"))
	//2

	bh.Handle(func(ctx *th.Context, update telego.Update) error {
		webAppButton := tu.InlineKeyboardButton("🌍 Открыть приложение").
			WithWebApp(&telego.WebAppInfo{URL: webAppURL})
		keyboard := tu.InlineKeyboard(tu.InlineKeyboardRow(webAppButton))

		message := tu.Message(
			tu.ID(update.Message.Chat.ID),
			"Неизвестная команда. Используй /start чтобы начать.",
		).WithReplyMarkup(keyboard)

		_, err := ctx.Bot().SendMessage(ctx, message)
		return err
	}, th.AnyCommand())
	log.Println("Бот запущен")
	_ = bh.Start()
}

/*
	bh.Handle(func(ctx *th.Context, update telego.Update) error {
		_, _ = ctx.Bot().SendMessage(ctx, tu.Message(
			tu.ID(update.Message.Chat.ID),
			fmt.Sprintf("Hello %s!", update.Message.From.FirstName),
		))
		return nil
	}, th.CommandEqual("start"))

	bh.Handle(func(ctx *th.Context, update telego.Update) error {
		_, _ = ctx.Bot().SendMessage(ctx, tu.Message(
			tu.ID(update.Message.Chat.ID),
			"Unknown command, use /start",
		))
		return nil
	}, th.AnyCommand())
*/
