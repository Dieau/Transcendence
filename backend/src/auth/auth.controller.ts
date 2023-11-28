import { Controller, Request, UseGuards, Get, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { GoogleOAuthGuard } from './guards/google-auth.guard'
import { DiscordOAuthGuard } from './guards/discord-auth.guard'
import { GithubOAuthGuard } from './guards/github-auth.guard'
import { School42OAuthGuard } from './guards/school42-auth.guard'

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(`google`)
  @UseGuards(GoogleOAuthGuard)
  googleAuth(@Request() req) {}

  @Get(`google-redirect`)
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req, @Res() res) {
    res.redirect(`${process.env.FRONTEND_URL}`)
    return req.red
  }

  @Get(`discord`)
  @UseGuards(DiscordOAuthGuard)
  discordAuth(@Request() req) {}

  @Get(`discord-redirect`)
  @UseGuards(DiscordOAuthGuard)
  discordAuthRedirect(@Request() req, @Res() res) {
    {
      res.redirect(`${process.env.FRONTEND_URL}`)
      return req.red
    }
  }

  @Get(`github`)
  @UseGuards(GithubOAuthGuard)
  githubAuth(@Request() req) {}

  @Get(`github-redirect`)
  @UseGuards(GithubOAuthGuard)
  githubAuthRedirect(@Request() req, @Res() res) {
    res.redirect(`${process.env.FRONTEND_URL}`)
    return req.red
  }

  @Get(`42`)
  @UseGuards(School42OAuthGuard)
  ftAuth(@Request() req) {}

  @Get(`42-redirect`)
  @UseGuards(School42OAuthGuard)
  ftAuthRedirect(@Request() req, @Res() res) {
    {
      res.redirect(`${process.env.FRONTEND_URL}`)
      return req.red
    }
  }
}
