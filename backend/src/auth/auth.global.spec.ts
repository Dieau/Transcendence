import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import { UnauthorizedException } from '@nestjs/common'


describe(`AuthService`, () => {
  let authService: AuthService
  let usersService: UsersService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, PrismaService],
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: `1h` },
        }),
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe(`flush DB`, () => {
    it(`flush userDB`, async () => {
      await usersService.deleteAll()
    })
  })

  describe(`signUpLocal`, () => {
    it(`Génération de comptes classiques avec combo mail/pass ou username/pass, ne doit pas générer d'erreur`, async () => {
      for (let i = 0; i < 10; i++) {
        const input = {
          username: `BITE${i}`,
          email: `grostest${i}@example.com`,
          password: `Pas$w0rd23()`,
        }

        jest.spyOn(usersService, `findOneByEmail`).mockResolvedValueOnce(null)

        const result = await authService.signUpLocal(input)
        const returnedUser = result.user as User

        expect(returnedUser.username).toEqual(input.username)
        expect(returnedUser.email).toEqual(input.email)
        expect(returnedUser.password).toHaveLength
        expect(returnedUser.githubId).toEqual(null)
        expect(returnedUser.googleId).toEqual(null)
        expect(returnedUser.school42Id).toEqual(null)
        expect(returnedUser.discordId).toEqual(null)
        expect(result.token).toHaveLength
      }
    })

    describe(`signinLocal`, () => {
      it(`Les comptes créés précedemment essaient maintenant de se connecter`, async () => {
        for (let i = 0; i < 10; i++) {
          const input = {
            emailOrUsername: `grostest${i}@example.com`,
            password: `Pas$w0rd23()`,
          }

          const associatedUser = await usersService.findOneByEmail(
            input.emailOrUsername,
          )

          const result = await authService.signInLocal(input)
          const returnedUser = result.user as User

          expect(returnedUser.username).toHaveLength
          expect(returnedUser.email).toEqual(input.emailOrUsername)
          expect(returnedUser.password).toHaveLength
          expect(returnedUser.githubId).toEqual(null)
          expect(returnedUser.googleId).toEqual(null)
          expect(returnedUser.school42Id).toEqual(null)
          expect(returnedUser.discordId).toEqual(null)
          expect(result.token).toHaveLength
          expect(returnedUser.id).toEqual(associatedUser.id)
        }
      })

      describe(`GoogleAuthCreate`, () => {
        it(`Génération de comptes via google auth, ne doit pas générer d'erreur`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              provider: `google`,
              mail: `grostest${i}@example.com`,
              username: `BITE${i}`,
              firstname: `Jean`,
              lastname: `D'eau`,
              picture: `https://URLDEOUF.COM`,
              locale: `fr`,
              authType: `oauth`,
            }

            jest
              .spyOn(usersService, `findOneByEmail`)
              .mockResolvedValueOnce(null)

            const result = await authService.googleLogin(input)
            const returnedUser = result.dbUser as User

            expect(returnedUser.username).toEqual(input.username)
            expect(returnedUser.email).toEqual(input.mail)
            expect(returnedUser.password).toEqual(null)
            expect(returnedUser.githubId).toEqual(null)
            expect(returnedUser.googleId).toEqual(input.mail)
            expect(returnedUser.school42Id).toEqual(null)
            expect(returnedUser.discordId).toEqual(null)
            expect(result.token).toHaveLength
          }
        })
      })

      describe(`GoogleAuthLogin`, () => {
        it(`Les comptes google oauth créés précedemment essaient maintenant de se connecter`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              provider: `google`,
              mail: `grostest${i}@example.com`,
              username: `BITE${i}`,
              firstname: `Jean`,
              lastname: `D'eau`,
              picture: `https://URLDEOUF.COM`,
              locale: `fr`,
              authType: `oauth`,
            }

            const associatedUser = await usersService.findOneByEmail(input.mail)

            const result = await authService.googleLogin(input)
            const returnedUser = result.dbUser as User

            expect(returnedUser.username).toEqual(input.username)
            expect(returnedUser.email).toEqual(input.mail)
            expect(returnedUser.password).toEqual(null)
            expect(returnedUser.githubId).toEqual(null)
            expect(returnedUser.googleId).toEqual(input.mail)
            expect(returnedUser.school42Id).toEqual(null)
            expect(returnedUser.discordId).toEqual(null)
            expect(result.token).toHaveLength
            expect(returnedUser.id).toEqual(associatedUser.id)
          }
        })
      })

      describe(`GoogleAccountTryLocalLogin`, () => {
        it(`Les comptes google oauth créés précedemment essaient maintenant de se connecter via 
		LEUR MAIL ET PAS DE PASSWORD sur le login flow classiques, ils peuvent aller se faire foutre`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              emailOrUsername: `grostest${i}@example.com`,
              password: null,
            }

            const associatedUser = await usersService.findOneByEmail(
              input.emailOrUsername,
            )

            expect(async () => {
              await authService.signInLocal(input)
            }).rejects.toThrow(UnauthorizedException)

            expect(associatedUser.id).toHaveLength
          }
        })
      })

      describe(`GoogleAccountTryLocalLogin`, () => {
        it(`Les comptes google oauth créés précedemment essaient maintenant de se connecter via 
		LEUR MAIL ET UN PASSWORD RANDOM sur le login flow classiques, ils peuvent aller se faire foutre`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              emailOrUsername: `grostest${i}@example.com`,
              password: `Prout59xd%()`,
            }

            const associatedUser = await usersService.findOneByEmail(
              input.emailOrUsername,
            )

            expect(async () => {
              await authService.signInLocal(input)
            }).rejects.toThrow(UnauthorizedException)

            expect(associatedUser.id).toHaveLength
          }
        })
      })

      describe(`GoogleAccountTryLocalLogin`, () => {
        it(`Les comptes google oauth créés précedemment essaient maintenant de se connecter via 
		LEUR USERNAME ET PAS DE MOT DE PASSE sur le login flow classiques, ils peuvent aller se faire foutre`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              emailOrUsername: `BITE${i}`,
              password: null,
            }

            const associatedUser = await usersService.findOneByUsername(
              input.emailOrUsername,
            )

            expect(async () => {
              await authService.signInLocal(input)
            }).rejects.toThrow(UnauthorizedException)

            expect(associatedUser.id).toHaveLength
          }
        })
      })

      describe(`GoogleAccountTryLocalLogin`, () => {
        it(`Les comptes google oauth créés précedemment essaient maintenant de se connecter via 
		LEUR USERNAME ET UN MOT DE PASSE RANDOM sur le login flow classiques, ils peuvent aller se faire foutre`, async () => {
          for (let i = 10; i < 20; i++) {
            const input = {
              emailOrUsername: `BITE${i}`,
              password: `Prout59xd%()`,
            }

            const associatedUser = await usersService.findOneByUsername(
              input.emailOrUsername,
            )

            expect(async () => {
              await authService.signInLocal(input)
            }).rejects.toThrow(UnauthorizedException)

            expect(associatedUser.id).toHaveLength
          }
        })
      })

      describe(`GoogleAuthLogin`, () => {
        it(`Les comptes classiques créés précedemment essaient maintenant de se connecter via 
		GOOGLE OAUTH, MEME MAIL, MEME USERNAME ils peuvent aller se faire foutre`, async () => {
          for (let i = 0; i < 10; i++) {
            const input = {
              provider: `google`,
              mail: `grostest${i}@example.com`,
              username: `BITE${i}`,
              firstname: `Jean`,
              lastname: `D'eau`,
              picture: `https://URLDEOUF.COM`,
              locale: `fr`,
              authType: `oauth`,
            }

            const associatedUser = await usersService.findOneByEmail(input.mail)

            expect(async () => {
              await authService.googleLogin(input)
            }).rejects.toThrow(UnauthorizedException)
            expect(associatedUser.id).toHaveLength
          }
        })
      })

      describe(`GoogleAuthLogin`, () => {
        it(`Les comptes classiques créés précedemment essaient maintenant de se connecter via 
		GOOGLE OAUTH, MAIL DIFFERENT, MEME USERNAME`, async () => {
          for (let i = 0; i < 10; i++) {
            const input = {
              provider: `google`,
              mail: `unautregrostest${i}@example.com`,
              username: `BITE${i}`,
              firstname: `Jean`,
              lastname: `D'eau`,
              picture: `https://URLDEOUF.COM`,
              locale: `fr`,
              authType: `oauth`,
            }

            jest
              .spyOn(usersService, `findOneByEmail`)
              .mockResolvedValueOnce(null)

            const result = await authService.googleLogin(input)
            const returnedUser = result.dbUser as User

            //here we check if the given username will be different on the db
            //we have no other users with the given mail, but another user with the same username
            expect(returnedUser.username).not.toBe(input.username)
            expect(returnedUser.email).toEqual(input.mail)
            expect(returnedUser.password).toEqual(null)
            expect(returnedUser.githubId).toEqual(null)
            expect(returnedUser.googleId).toEqual(input.mail)
            expect(returnedUser.school42Id).toEqual(null)
            expect(returnedUser.discordId).toEqual(null)
            expect(result.token).toHaveLength
          }
        })

        describe(`GoogleAuthLogin`, () => {
          it(`Les comptes classiques créés précedemment essaient maintenant de se connecter via 
			GOOGLE OAUTH, MEME MAIL, USERNAME DIFFERENT ils peuvent aller se faire foutre`, async () => {
            for (let i = 0; i < 10; i++) {
              const input = {
                provider: `google`,
                mail: `grostest${i}@example.com`,
                username: `ANOTHERBITE${i}`,
                firstname: `Jean`,
                lastname: `D'eau`,
                picture: `https://URLDEOUF.COM`,
                locale: `fr`,
                authType: `oauth`,
              }

              const associatedUser = await usersService.findOneByEmail(
                input.mail,
              )

              //here the site should block the user attempt because another user have
              //the same email
              expect(async () => {
                await authService.googleLogin(input)
              }).rejects.toThrow(UnauthorizedException)

              expect(associatedUser.id).toHaveLength
            }
          })
        })

        describe(`flush DB`, () => {
          it(`flush userDB`, async () => {
            await usersService.deleteAll()
          })
        })
      })
    })
  })
})

/***************************************************************************/
                           /*  DISCORD AUTH SPEC */
/***************************************************************************/

const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('backend/prisma/schema.prisma');

describe('Discord Authentication', () => {
  const user = {
    discord: {
      id: '1234567890',
      username: 'testuser',
      discriminator: '1234',
      email: 'testuser@example.com'
    }
  };

  const authenticateMock = jest.fn();
  const initializeMock = jest.fn();
  const useMock = jest.fn();
  passport.authenticate = authenticateMock;
  passport.initialize = initializeMock;
  passport.use = useMock;

  const findOneMock = jest.fn();
  DiscordUser.findOne = findOneMock;

  const discordStrategyMock = jest.fn();
  DiscordStrategy.mockImplementationOnce(discordStrategyMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Le Discord-Passport devrait être init', () => {
    require('../config/passport.config');
    expect(initializeMock).toHaveBeenCalled();
  });

  test('La stratégie Discord devrait être used', () => {
    require('../config/passport.config');
    expect(useMock).toHaveBeenCalledWith(expect.any(DiscordStrategy));
  });

  test('Ici la stratégie Discord devrait être bien set et configurée', () => {
    require('../config/passport.config');
    expect(discordStrategyMock).toHaveBeenCalledWith({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email']
    }, expect.any(Function));
  });

  test('Lauthentification via passport devrait être appelée par la stratégie Discord', () => {
    const authController = require('../controllers/auth.controller');
    const req = { user };
    authController.discordCallback(req);
    expect(authenticateMock).toHaveBeenCalledWith('discord', expect.any(Function));
  });

  test('Tentative de création de new user si rien dans la db', () => {
    const authController = require('../controllers/auth.controller');
    const doneCallback = jest.fn();
    const req = { user };
    const accessToken = 'test_access_token';
    const refreshToken = 'test_refresh_token';

    findOneMock.mockResolvedValue(null);

    authController.discordCallback(req, accessToken, refreshToken, doneCallback);

    expect(DiscordUser.findOne).toHaveBeenCalledWith({ 'discord.id': user.discord.id });
    expect(DiscordUser.create).toHaveBeenCalledWith({
      discord: user.discord,
      accessToken,
      refreshToken
    });

    expect(doneCallback).toHaveBeenCalledWith(null, expect.any(DiscordUser));
  });

  test('Si le user est déjà dans la db, il se fait bien update', () => {
    const authController = require('../controllers/auth.controller');
    const doneCallback = jest.fn();
    const req = { user };
    const accessToken = 'test_access_token';
    const refreshToken = 'test_refresh_token';

    findOneMock.mockResolvedValue(user);

    authController.discordCallback(req, accessToken, refreshToken, doneCallback);

    expect(DiscordUser.findOne).toHaveBeenCalledWith({ 'discord.id': user.discord.id });
    expect(DiscordUser.findByIdAndUpdate).toHaveBeenCalledWith(user.discord.id, {
      discord: user.discord,
      accessToken,
      refreshToken
    }, { new: true });

    expect(doneCallback).toHaveBeenCalledWith(null, expect.any(DiscordUser));
  });
});
