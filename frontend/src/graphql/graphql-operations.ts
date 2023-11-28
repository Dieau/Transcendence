import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import type * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Channel = {
  __typename?: 'Channel';
  avatarUrl?: Maybe<Scalars['String']>;
  channelMembers?: Maybe<Array<ChannelMember>>;
  channelMessages?: Maybe<Array<ChannelMessage>>;
  channelType: EChannelType;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ChannelMember = {
  __typename?: 'ChannelMember';
  channel: Channel;
  channelId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  muted: Scalars['Boolean'];
  type: EChannelMemberType;
  updatedAt: Scalars['DateTime'];
  user: UserPublic;
  userId: Scalars['String'];
};

export type ChannelMessage = {
  __typename?: 'ChannelMessage';
  channelId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  message: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type CheckChannelInput = {
  channelName: Scalars['String'];
};

export type CreateChannelInput = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  channelType: EChannelType;
  name: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
};

export type CreateMemberForChannelInput = {
  channelId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateMessageForChannelInput = {
  channelId: Scalars['String'];
  message: Scalars['String'];
};

export type CreateMyMemberForChannelInput = {
  channelId: Scalars['String'];
  channelPassword?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<EChannelMemberType>;
};

export type CreateRequestFriendInput = {
  userTargetId: Scalars['String'];
};

export type DeleteChannelInput = {
  id: Scalars['String'];
};

export type DeleteGameInput = {
  id: Scalars['String'];
};

export type DeleteMemberForChannelInput = {
  channelId: Scalars['String'];
  userId: Scalars['String'];
};

export type DeleteMyMemberForChannelInput = {
  channelId: Scalars['String'];
};

export type DeleteMyMessageForChannelInput = {
  id: Scalars['String'];
};

export enum EChannelMemberType {
  Admin = 'Admin',
  Banned = 'Banned',
  Default = 'Default',
  Invited = 'Invited',
  Owner = 'Owner'
}

export enum EChannelType {
  Direct = 'Direct',
  Private = 'Private',
  Protected = 'Protected',
  Public = 'Public'
}

export enum EUserPresenceStatus {
  InGame = 'InGame',
  Offline = 'Offline',
  Online = 'Online'
}

export enum EUserRealtionType {
  Blocked = 'Blocked',
  Friend = 'Friend',
  PendingAccept = 'PendingAccept',
  Terminated = 'Terminated',
  WaitingAccept = 'WaitingAccept'
}

export type FindAllChannelMembersForChannelInput = {
  channelId: Scalars['String'];
};

export type FindAllMessagesForChannelInput = {
  channelId: Scalars['String'];
};

export type FindChannelInput = {
  id: Scalars['String'];
};

export type FindMyChannelMemberForChannelInput = {
  channelId: Scalars['String'];
};

export type FindUserForChannelMessageInput = {
  id: Scalars['String'];
};

export type FindUserInput = {
  id: Scalars['String'];
};

export type FindUserPresencesInput = {
  userId: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  createdAt: Scalars['DateTime'];
  gameMembers?: Maybe<Array<GameMember>>;
  id: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  message: Scalars['String'];
  targetUserId?: Maybe<Scalars['String']>;
};

export type GameData = {
  __typename?: 'GameData';
  createdAt: Scalars['DateTime'];
  gameMembers?: Maybe<Array<GameMember>>;
  id: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  message: Scalars['String'];
  targetUserId?: Maybe<Scalars['String']>;
};

export type GameMatchmakingMember = {
  __typename?: 'GameMatchmakingMember';
  isDeleted: Scalars['Boolean'];
  isLaunched?: Maybe<Scalars['Boolean']>;
  message: Scalars['String'];
  targetUserId?: Maybe<Scalars['String']>;
  userGameInfos: UserPublicGameInfos;
  userId: Scalars['String'];
};

export type GameMember = {
  __typename?: 'GameMember';
  gameId: Scalars['String'];
  score: Scalars['Float'];
  userGameInfos: UserPublicGameInfos;
  userId: Scalars['String'];
};

export type GameRatio = {
  __typename?: 'GameRatio';
  date: Scalars['DateTime'];
  ratio: Scalars['Float'];
};

export type GameStat = {
  __typename?: 'GameStat';
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isDeleted: Scalars['Boolean'];
  isWinner?: Maybe<Scalars['Boolean']>;
  opponentId?: Maybe<Scalars['String']>;
  opponentScore?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  userScore?: Maybe<Scalars['String']>;
};

export type GeneralUserGameStats = {
  __typename?: 'GeneralUserGameStats';
  MeanPoints: Scalars['Float'];
  allTimeRatio: Scalars['Float'];
  gamesCount: Scalars['Float'];
  leaderBoardPosition: Scalars['Float'];
};

export type GoogleAuthCodeValidatorInput = {
  code: Scalars['String'];
};

export type JoinGameInput = {
  id: Scalars['String'];
};

export type LeaderBoardUser = {
  __typename?: 'LeaderBoardUser';
  avatarUrl: Scalars['String'];
  id: Scalars['String'];
  ratio: Scalars['Float'];
  username: Scalars['String'];
  winrate: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  DEBUGkilleallgames: Array<Game>;
  acceptFriendRequest: UserRelation;
  blockRelation: UserRelation;
  createChannel: Channel;
  createGame: GameData;
  createMemberForChannel: ChannelMember;
  createMessageForChannel: ChannelMessage;
  createMyMemberForChannel: ChannelMember;
  createRequestFriend: UserRelation;
  deleteChannel: Channel;
  deleteGame: Game;
  deleteMemberForChannel: ChannelMember;
  deleteMyMemberForChannel: ChannelMember;
  deleteMyMessageForChannel: ChannelMessage;
  deleteMyUser: Scalars['Boolean'];
  isGoogleAuthCodeValid: Scalars['Boolean'];
  joinGame: Game;
  joinGameMatchmakingMember: GameMatchmakingMember;
  leaveGame: Scalars['Boolean'];
  leaveGameMatchmakingMember: GameMatchmakingMember;
  logout: Scalars['Boolean'];
  refuseFriendRequest: UserRelation;
  refuseMatchMakingInvite: GameMatchmakingMember;
  refusePrivateGameInvitation: Scalars['Boolean'];
  removeFriend: UserRelation;
  sendDirectMessage: Channel;
  signIn42: Scalars['Boolean'];
  signInDiscord: Scalars['Boolean'];
  signInGithub: Scalars['Boolean'];
  signInGoogle: Scalars['Boolean'];
  signInLocal: User;
  signUpLocal: User;
  unblockRelation: UserRelation;
  updateChannel: Channel;
  updateGame: GameData;
  updateGameMemberForGame: GameMember;
  updateMemberForChannel: ChannelMember;
  updateMyMessageForChannel: ChannelMessage;
  updateMyPassword: Scalars['Boolean'];
  updateMyUser: User;
  updateUserPresence: UserPresence;
};


export type MutationAcceptFriendRequestArgs = {
  args: UpdateUserRelationInput;
};


export type MutationBlockRelationArgs = {
  args: UpdateUserRelationInput;
};


export type MutationCreateChannelArgs = {
  args: CreateChannelInput;
};


export type MutationCreateGameArgs = {
  message?: InputMaybe<Scalars['String']>;
  userTargetId?: InputMaybe<Scalars['String']>;
};


export type MutationCreateMemberForChannelArgs = {
  args: CreateMemberForChannelInput;
};


export type MutationCreateMessageForChannelArgs = {
  args: CreateMessageForChannelInput;
};


export type MutationCreateMyMemberForChannelArgs = {
  args: CreateMyMemberForChannelInput;
};


export type MutationCreateRequestFriendArgs = {
  args: CreateRequestFriendInput;
};


export type MutationDeleteChannelArgs = {
  args: DeleteChannelInput;
};


export type MutationDeleteGameArgs = {
  args: DeleteGameInput;
};


export type MutationDeleteMemberForChannelArgs = {
  args: DeleteMemberForChannelInput;
};


export type MutationDeleteMyMemberForChannelArgs = {
  args: DeleteMyMemberForChannelInput;
};


export type MutationDeleteMyMessageForChannelArgs = {
  args: DeleteMyMessageForChannelInput;
};


export type MutationIsGoogleAuthCodeValidArgs = {
  args: GoogleAuthCodeValidatorInput;
};


export type MutationJoinGameArgs = {
  args: JoinGameInput;
};


export type MutationJoinGameMatchmakingMemberArgs = {
  message?: InputMaybe<Scalars['String']>;
  userTargetId?: InputMaybe<Scalars['String']>;
};


export type MutationRefuseFriendRequestArgs = {
  args: UpdateUserRelationInput;
};


export type MutationRefuseMatchMakingInviteArgs = {
  matchMakerId: Scalars['String'];
};


export type MutationRefusePrivateGameInvitationArgs = {
  gameId: Scalars['String'];
};


export type MutationRemoveFriendArgs = {
  args: UpdateUserRelationInput;
};


export type MutationSendDirectMessageArgs = {
  args: SendDirectMessageInput;
};


export type MutationSignInLocalArgs = {
  args: SignInLocalInput;
};


export type MutationSignUpLocalArgs = {
  args: SignUpLocalInput;
};


export type MutationUnblockRelationArgs = {
  args: UpdateUserRelationInput;
};


export type MutationUpdateChannelArgs = {
  args: UpdateChannelInput;
};


export type MutationUpdateGameArgs = {
  args: UpdateGameInput;
};


export type MutationUpdateGameMemberForGameArgs = {
  args: UpdateGameMemberInput;
};


export type MutationUpdateMemberForChannelArgs = {
  args: UpdateMyMemberForChannelInput;
};


export type MutationUpdateMyMessageForChannelArgs = {
  args: UpdateMyMessageForChannelInput;
};


export type MutationUpdateMyPasswordArgs = {
  args: UpdateMyPasswordInput;
};


export type MutationUpdateMyUserArgs = {
  args: UpdateMyUserInput;
};


export type MutationUpdateUserPresenceArgs = {
  args: UpdateUserPresenceInput;
};

export type OnChannelInput = {
  id: Scalars['String'];
};

export type OnChannelMemberChannelInput = {
  channelId: Scalars['String'];
};

export type OnChannelMemberUserInput = {
  userId: Scalars['String'];
};

export type OnDeleteChannelMessageForChannel = {
  channelId: Scalars['String'];
};

export type OnNewChannelMessageForChannelIdInput = {
  channelId: Scalars['String'];
};

export type OnUpdateUserPresenceInput = {
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  checkChannelName: Scalars['Boolean'];
  findAllBlockedByForUser: Array<UserRelation>;
  findAllBlockedForUser: Array<UserRelation>;
  findAllChannelMembersForChannel: Array<ChannelMember>;
  findAllChannelMessagesForChannel: Array<ChannelMessage>;
  findAllChannels: Array<Channel>;
  findAllChannelsForUser: Array<Channel>;
  findAllFriendsForUser: Array<UserRelation>;
  findAllGameMatchmakingMemberl: Array<GameMatchmakingMember>;
  findAllGameStatsForUser: Array<GameStat>;
  findAllGameStatsSoftLimit: Array<GameStat>;
  findAllGames: Array<Game>;
  findAllPublicGameStatsForUser: Array<GameStat>;
  findAllRelationsForMyUser: Array<UserRelation>;
  findAllVisibleChannels: Array<Channel>;
  findChannel: Channel;
  findGame: Game;
  findGeneralGameStatsForUser: GeneralUserGameStats;
  findLeaderboardUserList: Array<LeaderBoardUser>;
  findMyChannelMemberForChannel: ChannelMember;
  findMyUser: User;
  findPublicGameInfosForUser: UserPublicGameInfos;
  findPublicGameRatios: Array<GameRatio>;
  findPublicGeneralGameStatsForUser: GeneralUserGameStats;
  findPublicUsersList: Array<UserPublic>;
  findRelation?: Maybe<UserRelation>;
  findUser: UserPublic;
  findUserForChannelMessage: UserPublic;
  findUserPresence: UserPresence;
  findUserTwoFaSettings: UserTwoFaSettings;
  getUserGameBeforeStart?: Maybe<Game>;
};


export type QueryCheckChannelNameArgs = {
  args: CheckChannelInput;
};


export type QueryFindAllChannelMembersForChannelArgs = {
  args: FindAllChannelMembersForChannelInput;
};


export type QueryFindAllChannelMessagesForChannelArgs = {
  args: FindAllMessagesForChannelInput;
};


export type QueryFindAllPublicGameStatsForUserArgs = {
  userid: Scalars['String'];
};


export type QueryFindChannelArgs = {
  args: FindChannelInput;
};


export type QueryFindMyChannelMemberForChannelArgs = {
  args: FindMyChannelMemberForChannelInput;
};


export type QueryFindPublicGameInfosForUserArgs = {
  userid: Scalars['String'];
};


export type QueryFindPublicGameRatiosArgs = {
  userid: Scalars['String'];
};


export type QueryFindPublicGeneralGameStatsForUserArgs = {
  userid: Scalars['String'];
};


export type QueryFindRelationArgs = {
  userId: Scalars['String'];
};


export type QueryFindUserArgs = {
  args: FindUserInput;
};


export type QueryFindUserForChannelMessageArgs = {
  args: FindUserForChannelMessageInput;
};


export type QueryFindUserPresenceArgs = {
  args: FindUserPresencesInput;
};

export type SendDirectMessageInput = {
  otherUserId: Scalars['String'];
};

export type SignInLocalInput = {
  doubleAuthCode: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignUpLocalInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  UserGameUpdated: Game;
  allGamesStatsUpdated?: Maybe<GameStat>;
  allGamesStatsUpdatedForUser: GameStat;
  allGamesUpdated?: Maybe<Game>;
  matchmakingMembersChanged: GameMatchmakingMember;
  onCreateChannel: Channel;
  onDeleteChannel: Channel;
  onDeleteChannelMemberForChannelId: ChannelMember;
  onDeleteChannelMemberForUserlId: ChannelMember;
  onDeleteChannelMessageForChannel: ChannelMessage;
  onNewChannelMemberForChannelId: ChannelMember;
  onNewChannelMemberForUserId: ChannelMember;
  onNewChannelMessageForChannelId: ChannelMessage;
  onNewVisibleChannel: Channel;
  onUpdateChannel: Channel;
  onUpdateChannelMemberForChannelId: ChannelMember;
  onUpdateChannelMemberForUserlId: ChannelMember;
  onUpdateUserPresence: UserPresence;
  userRelationsChanged: UserRelation;
};


export type SubscriptionUserGameUpdatedArgs = {
  userId: Scalars['String'];
};


export type SubscriptionAllGamesStatsUpdatedForUserArgs = {
  userId: Scalars['String'];
};


export type SubscriptionOnDeleteChannelArgs = {
  args: OnChannelInput;
};


export type SubscriptionOnDeleteChannelMemberForChannelIdArgs = {
  args: OnChannelMemberChannelInput;
};


export type SubscriptionOnDeleteChannelMemberForUserlIdArgs = {
  args: OnChannelMemberUserInput;
};


export type SubscriptionOnDeleteChannelMessageForChannelArgs = {
  args: OnDeleteChannelMessageForChannel;
};


export type SubscriptionOnNewChannelMemberForChannelIdArgs = {
  args: OnChannelMemberChannelInput;
};


export type SubscriptionOnNewChannelMemberForUserIdArgs = {
  args: OnChannelMemberUserInput;
};


export type SubscriptionOnNewChannelMessageForChannelIdArgs = {
  args: OnNewChannelMessageForChannelIdInput;
};


export type SubscriptionOnUpdateChannelArgs = {
  args: OnChannelInput;
};


export type SubscriptionOnUpdateChannelMemberForChannelIdArgs = {
  args: OnChannelMemberChannelInput;
};


export type SubscriptionOnUpdateChannelMemberForUserlIdArgs = {
  args: OnChannelMemberUserInput;
};


export type SubscriptionOnUpdateUserPresenceArgs = {
  args: OnUpdateUserPresenceInput;
};


export type SubscriptionUserRelationsChangedArgs = {
  userId: Scalars['String'];
};

export type UpdateChannelInput = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  channelType?: InputMaybe<EChannelType>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type UpdateGameInput = {
  id: Scalars['String'];
};

export type UpdateGameMemberInput = {
  gameId: Scalars['String'];
};

export type UpdateMyMemberForChannelInput = {
  channelId: Scalars['String'];
  muted?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<EChannelMemberType>;
  userId: Scalars['String'];
};

export type UpdateMyMessageForChannelInput = {
  channelId: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
};

export type UpdateMyPasswordInput = {
  newPassword: Scalars['String'];
};

export type UpdateMyUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  doubleAuth?: InputMaybe<Scalars['Boolean']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateUserPresenceInput = {
  connected: EUserPresenceStatus;
};

export type UpdateUserRelationInput = {
  userTargetid: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  doubleAuth: Scalars['Boolean'];
  id: Scalars['String'];
  isOauth: Scalars['Boolean'];
  username: Scalars['String'];
};

export type UserPresence = {
  __typename?: 'UserPresence';
  connected: EUserPresenceStatus;
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type UserPublic = {
  __typename?: 'UserPublic';
  avatarUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  username: Scalars['String'];
};

export type UserPublicGameInfos = {
  __typename?: 'UserPublicGameInfos';
  avatarUrl: Scalars['String'];
  id: Scalars['String'];
  ratio: Scalars['Float'];
  username: Scalars['String'];
};

export type UserRelation = {
  __typename?: 'UserRelation';
  createdAt: Scalars['DateTime'];
  friendInfos: UserPublicGameInfos;
  type: EUserRealtionType;
  updatedAt: Scalars['DateTime'];
  userOwner?: Maybe<UserPublic>;
  userOwnerId: Scalars['ID'];
  userTarget?: Maybe<UserPublic>;
  userTargetId: Scalars['String'];
};

export type UserTwoFaSettings = {
  __typename?: 'UserTwoFaSettings';
  googleAuthenticatorQrCode: Scalars['String'];
};

export type SignInLocalMutationVariables = Exact<{
  args: SignInLocalInput;
}>;


export type SignInLocalMutation = { __typename?: 'Mutation', signInLocal: { __typename?: 'User', avatarUrl?: string | null, doubleAuth: boolean, id: string, username: string } };

export type SignUpLocalMutationVariables = Exact<{
  args: SignUpLocalInput;
}>;


export type SignUpLocalMutation = { __typename?: 'Mutation', signUpLocal: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null, doubleAuth: boolean } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateChannelMutationVariables = Exact<{
  args: CreateChannelInput;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'Channel', id: string } };

export type UpdateChannelMutationVariables = Exact<{
  args: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { __typename?: 'Mutation', updateChannel: { __typename?: 'Channel', id: string } };

export type DeleteChannelMutationVariables = Exact<{
  args: DeleteChannelInput;
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: { __typename?: 'Channel', id: string } };

export type FindAllVisibleChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllVisibleChannelsQuery = { __typename?: 'Query', findAllVisibleChannels: Array<{ __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any }> };

export type FindAllChannelsForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllChannelsForUserQuery = { __typename?: 'Query', findAllChannelsForUser: Array<{ __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any }> };

export type FindChannelQueryVariables = Exact<{
  args: FindChannelInput;
}>;


export type FindChannelQuery = { __typename?: 'Query', findChannel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type CheckChannelNameQueryVariables = Exact<{
  args: CheckChannelInput;
}>;


export type CheckChannelNameQuery = { __typename?: 'Query', checkChannelName: boolean };

export type OnCreateChannelSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateChannelSubscription = { __typename?: 'Subscription', onCreateChannel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type OnUpdateChannelSubscriptionVariables = Exact<{
  args: OnChannelInput;
}>;


export type OnUpdateChannelSubscription = { __typename?: 'Subscription', onUpdateChannel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type OnDeleteChannelSubscriptionVariables = Exact<{
  args: OnChannelInput;
}>;


export type OnDeleteChannelSubscription = { __typename?: 'Subscription', onDeleteChannel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type SendDirectMessageMutationVariables = Exact<{
  args: SendDirectMessageInput;
}>;


export type SendDirectMessageMutation = { __typename?: 'Mutation', sendDirectMessage: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type OnNewVisibleChannelSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNewVisibleChannelSubscription = { __typename?: 'Subscription', onNewVisibleChannel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } };

export type CreateMyMemberForChannelMutationVariables = Exact<{
  args: CreateMyMemberForChannelInput;
}>;


export type CreateMyMemberForChannelMutation = { __typename?: 'Mutation', createMyMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string } };

export type CreateMemberForChannelMutationVariables = Exact<{
  args: CreateMemberForChannelInput;
}>;


export type CreateMemberForChannelMutation = { __typename?: 'Mutation', createMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string } };

export type UpdateMemberForChannelMutationVariables = Exact<{
  args: UpdateMyMemberForChannelInput;
}>;


export type UpdateMemberForChannelMutation = { __typename?: 'Mutation', updateMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string } };

export type DeleteMemberForChannelMutationVariables = Exact<{
  args: DeleteMemberForChannelInput;
}>;


export type DeleteMemberForChannelMutation = { __typename?: 'Mutation', deleteMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string } };

export type DeleteMyMemberForChannelMutationVariables = Exact<{
  args: DeleteMyMemberForChannelInput;
}>;


export type DeleteMyMemberForChannelMutation = { __typename?: 'Mutation', deleteMyMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string } };

export type FindAllChannelMembersForChannelQueryVariables = Exact<{
  args: FindAllChannelMembersForChannelInput;
}>;


export type FindAllChannelMembersForChannelQuery = { __typename?: 'Query', findAllChannelMembersForChannel: Array<{ __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } }> };

export type FindMyChannelMemberForChannelQueryVariables = Exact<{
  args: FindMyChannelMemberForChannelInput;
}>;


export type FindMyChannelMemberForChannelQuery = { __typename?: 'Query', findMyChannelMemberForChannel: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any } };

export type OnNewChannelMemberForChannelIdSubscriptionVariables = Exact<{
  args: OnChannelMemberChannelInput;
}>;


export type OnNewChannelMemberForChannelIdSubscription = { __typename?: 'Subscription', onNewChannelMemberForChannelId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } } };

export type OnUpdateChannelMemberForChannelIdSubscriptionVariables = Exact<{
  args: OnChannelMemberChannelInput;
}>;


export type OnUpdateChannelMemberForChannelIdSubscription = { __typename?: 'Subscription', onUpdateChannelMemberForChannelId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } } };

export type OnDeleteChannelMemberForChannelIdSubscriptionVariables = Exact<{
  args: OnChannelMemberChannelInput;
}>;


export type OnDeleteChannelMemberForChannelIdSubscription = { __typename?: 'Subscription', onDeleteChannelMemberForChannelId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } } };

export type OnNewChannelMemberForUserIdSubscriptionVariables = Exact<{
  args: OnChannelMemberUserInput;
}>;


export type OnNewChannelMemberForUserIdSubscription = { __typename?: 'Subscription', onNewChannelMemberForUserId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, channel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } } };

export type OnUpdateChannelMemberForUserlIdSubscriptionVariables = Exact<{
  args: OnChannelMemberUserInput;
}>;


export type OnUpdateChannelMemberForUserlIdSubscription = { __typename?: 'Subscription', onUpdateChannelMemberForUserlId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, channel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } } };

export type OnDeleteChannelMemberForUserlIdSubscriptionVariables = Exact<{
  args: OnChannelMemberUserInput;
}>;


export type OnDeleteChannelMemberForUserlIdSubscription = { __typename?: 'Subscription', onDeleteChannelMemberForUserlId: { __typename?: 'ChannelMember', channelId: string, userId: string, type: EChannelMemberType, muted: boolean, createdAt: any, updatedAt: any, channel: { __typename?: 'Channel', id: string, name: string, avatarUrl?: string | null, channelType: EChannelType, createdAt: any } } };

export type ChannelMessageFragment = { __typename?: 'ChannelMessage', id: string, message: string, channelId: string, userId: string, createdAt: any, updatedAt: any };

export type CreateMessageForChannelMutationVariables = Exact<{
  args: CreateMessageForChannelInput;
}>;


export type CreateMessageForChannelMutation = { __typename?: 'Mutation', createMessageForChannel: { __typename?: 'ChannelMessage', id: string } };

export type DeleteMyMessageForChannelMutationVariables = Exact<{
  args: DeleteMyMessageForChannelInput;
}>;


export type DeleteMyMessageForChannelMutation = { __typename?: 'Mutation', deleteMyMessageForChannel: { __typename?: 'ChannelMessage', id: string } };

export type FindAllChannelMessagesForChannelQueryVariables = Exact<{
  args: FindAllMessagesForChannelInput;
}>;


export type FindAllChannelMessagesForChannelQuery = { __typename?: 'Query', findAllChannelMessagesForChannel: Array<{ __typename?: 'ChannelMessage', id: string, message: string, channelId: string, userId: string, createdAt: any, updatedAt: any }> };

export type FindUserForChannelMessageQueryVariables = Exact<{
  args: FindUserForChannelMessageInput;
}>;


export type FindUserForChannelMessageQuery = { __typename?: 'Query', findUserForChannelMessage: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } };

export type OnNewChannelMessageForChannelIdSubscriptionVariables = Exact<{
  args: OnNewChannelMessageForChannelIdInput;
}>;


export type OnNewChannelMessageForChannelIdSubscription = { __typename?: 'Subscription', onNewChannelMessageForChannelId: { __typename?: 'ChannelMessage', id: string, message: string, channelId: string, userId: string, createdAt: any, updatedAt: any } };

export type OnDeleteChannelMessageForChannelSubscriptionVariables = Exact<{
  args: OnDeleteChannelMessageForChannel;
}>;


export type OnDeleteChannelMessageForChannelSubscription = { __typename?: 'Subscription', onDeleteChannelMessageForChannel: { __typename?: 'ChannelMessage', id: string } };

export type AllGamesUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AllGamesUpdatedSubscription = { __typename?: 'Subscription', allGamesUpdated?: { __typename?: 'Game', id: string, message: string, isDeleted: boolean, createdAt: any, targetUserId?: string | null, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, score: number, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null } | null };

export type FindAllGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllGamesQuery = { __typename?: 'Query', findAllGames: Array<{ __typename?: 'Game', id: string, message: string, isDeleted: boolean, createdAt: any, targetUserId?: string | null, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, score: number, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null }> };

export type CreateGameMutationVariables = Exact<{
  message?: InputMaybe<Scalars['String']>;
  userTargetId?: InputMaybe<Scalars['String']>;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'GameData', id: string, message: string, isDeleted: boolean, createdAt: any, targetUserId?: string | null, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null } };

export type LeaveGameMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveGameMutation = { __typename?: 'Mutation', leaveGame: boolean };

export type FindPublicGameInfosForUserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type FindPublicGameInfosForUserQuery = { __typename?: 'Query', findPublicGameInfosForUser: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } };

export type LeaveGameMatchmakingMemberMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveGameMatchmakingMemberMutation = { __typename?: 'Mutation', leaveGameMatchmakingMember: { __typename?: 'GameMatchmakingMember', userId: string, message: string } };

export type JoinGameMatchmakingMemberMutationVariables = Exact<{
  message?: InputMaybe<Scalars['String']>;
  userTargetId?: InputMaybe<Scalars['String']>;
}>;


export type JoinGameMatchmakingMemberMutation = { __typename?: 'Mutation', joinGameMatchmakingMember: { __typename?: 'GameMatchmakingMember', userId: string, message: string, isDeleted: boolean, targetUserId?: string | null, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } } };

export type DeleteGameMutationVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type DeleteGameMutation = { __typename?: 'Mutation', deleteGame: { __typename?: 'Game', id: string, message: string, isDeleted: boolean, targetUserId?: string | null, createdAt: any } };

export type JoinGameMutationVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinGame: { __typename?: 'Game', message: string, isDeleted: boolean, targetUserId?: string | null, createdAt: any, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null } };

export type MatchmakingMembersChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MatchmakingMembersChangedSubscription = { __typename?: 'Subscription', matchmakingMembersChanged: { __typename?: 'GameMatchmakingMember', userId: string, isDeleted: boolean, targetUserId?: string | null, isLaunched?: boolean | null, message: string, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } } };

export type UserGameUpdatedSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserGameUpdatedSubscription = { __typename?: 'Subscription', UserGameUpdated: { __typename?: 'Game', id: string, message: string, isDeleted: boolean, targetUserId?: string | null, createdAt: any, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, score: number, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null } };

export type GetUserGameBeforeStartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserGameBeforeStartQuery = { __typename?: 'Query', getUserGameBeforeStart?: { __typename?: 'Game', id: string, message: string, isDeleted: boolean, targetUserId?: string | null, createdAt: any, gameMembers?: Array<{ __typename?: 'GameMember', gameId: string, userId: string, score: number, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> | null } | null };

export type FindAllGameMatchmakingMemberlQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllGameMatchmakingMemberlQuery = { __typename?: 'Query', findAllGameMatchmakingMemberl: Array<{ __typename?: 'GameMatchmakingMember', userId: string, isDeleted: boolean, targetUserId?: string | null, isLaunched?: boolean | null, message: string, userGameInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> };

export type RefusePrivateGameInvitationMutationVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type RefusePrivateGameInvitationMutation = { __typename?: 'Mutation', refusePrivateGameInvitation: boolean };

export type RefuseMatchMakingInviteMutationVariables = Exact<{
  matchMakerId: Scalars['String'];
}>;


export type RefuseMatchMakingInviteMutation = { __typename?: 'Mutation', refuseMatchMakingInvite: { __typename?: 'GameMatchmakingMember', userId: string, message: string, isDeleted: boolean, targetUserId?: string | null } };

export type AllGamesStatsUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AllGamesStatsUpdatedSubscription = { __typename?: 'Subscription', allGamesStatsUpdated?: { __typename?: 'GameStat', id?: string | null, opponentId?: string | null, isWinner?: boolean | null, userScore?: string | null, opponentScore?: string | null, createdAt?: string | null, isDeleted: boolean } | null };

export type AllGamesStatsUpdatedForUserSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type AllGamesStatsUpdatedForUserSubscription = { __typename?: 'Subscription', allGamesStatsUpdatedForUser: { __typename?: 'GameStat', id?: string | null, opponentId?: string | null, userId?: string | null, isWinner?: boolean | null, userScore?: string | null, opponentScore?: string | null, createdAt?: string | null, isDeleted: boolean } };

export type FindAllGameStatsSoftLimitQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllGameStatsSoftLimitQuery = { __typename?: 'Query', findAllGameStatsSoftLimit: Array<{ __typename?: 'GameStat', id?: string | null, userId?: string | null, opponentId?: string | null, isWinner?: boolean | null, userScore?: string | null, opponentScore?: string | null, createdAt?: string | null, isDeleted: boolean }> };

export type FindLeaderboardUserListQueryVariables = Exact<{ [key: string]: never; }>;


export type FindLeaderboardUserListQuery = { __typename?: 'Query', findLeaderboardUserList: Array<{ __typename?: 'LeaderBoardUser', id: string, username: string, avatarUrl: string, ratio: number, winrate: number }> };

export type FindMyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindMyUserQuery = { __typename?: 'Query', findMyUser: { __typename?: 'User', id: string, doubleAuth: boolean, avatarUrl?: string | null, username: string, isOauth: boolean } };

export type FindUserTwoFaSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindUserTwoFaSettingsQuery = { __typename?: 'Query', findUserTwoFaSettings: { __typename?: 'UserTwoFaSettings', googleAuthenticatorQrCode: string } };

export type UpdateMyUserMutationVariables = Exact<{
  args: UpdateMyUserInput;
}>;


export type UpdateMyUserMutation = { __typename?: 'Mutation', updateMyUser: { __typename?: 'User', id: string, doubleAuth: boolean, avatarUrl?: string | null, username: string, isOauth: boolean } };

export type UpdateMyPasswordMutationVariables = Exact<{
  args: UpdateMyPasswordInput;
}>;


export type UpdateMyPasswordMutation = { __typename?: 'Mutation', updateMyPassword: boolean };

export type IsGoogleAuthCodeValidMutationVariables = Exact<{
  args: GoogleAuthCodeValidatorInput;
}>;


export type IsGoogleAuthCodeValidMutation = { __typename?: 'Mutation', isGoogleAuthCodeValid: boolean };

export type FindPublicGameRatiosQueryVariables = Exact<{
  userid: Scalars['String'];
}>;


export type FindPublicGameRatiosQuery = { __typename?: 'Query', findPublicGameRatios: Array<{ __typename?: 'GameRatio', date: any, ratio: number }> };

export type FindGeneralGameStatsForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindGeneralGameStatsForUserQuery = { __typename?: 'Query', findGeneralGameStatsForUser: { __typename?: 'GeneralUserGameStats', gamesCount: number, allTimeRatio: number, MeanPoints: number, leaderBoardPosition: number } };

export type FindAllGameStatsForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllGameStatsForUserQuery = { __typename?: 'Query', findAllGameStatsForUser: Array<{ __typename?: 'GameStat', id?: string | null, opponentId?: string | null, isWinner?: boolean | null, userScore?: string | null, opponentScore?: string | null, createdAt?: string | null }> };

export type FindPublicGeneralGameStatsForUserQueryVariables = Exact<{
  userid: Scalars['String'];
}>;


export type FindPublicGeneralGameStatsForUserQuery = { __typename?: 'Query', findPublicGeneralGameStatsForUser: { __typename?: 'GeneralUserGameStats', gamesCount: number, allTimeRatio: number, MeanPoints: number, leaderBoardPosition: number } };

export type FindAllPublicGameStatsForUserQueryVariables = Exact<{
  userid: Scalars['String'];
}>;


export type FindAllPublicGameStatsForUserQuery = { __typename?: 'Query', findAllPublicGameStatsForUser: Array<{ __typename?: 'GameStat', id?: string | null, opponentId?: string | null, isWinner?: boolean | null, userScore?: string | null, opponentScore?: string | null, createdAt?: string | null }> };

export type FindUserQueryVariables = Exact<{
  args: FindUserInput;
}>;


export type FindUserQuery = { __typename?: 'Query', findUser: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } };

export type FindPublicUsersListQueryVariables = Exact<{ [key: string]: never; }>;


export type FindPublicUsersListQuery = { __typename?: 'Query', findPublicUsersList: Array<{ __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null }> };

export type FindUserPresenceQueryVariables = Exact<{
  args: FindUserPresencesInput;
}>;


export type FindUserPresenceQuery = { __typename?: 'Query', findUserPresence: { __typename?: 'UserPresence', id: string, userId: string, connected: EUserPresenceStatus, updatedAt: any } };

export type UpdateUserPresenceMutationVariables = Exact<{
  args: UpdateUserPresenceInput;
}>;


export type UpdateUserPresenceMutation = { __typename?: 'Mutation', updateUserPresence: { __typename?: 'UserPresence', id: string, userId: string, connected: EUserPresenceStatus, updatedAt: any } };

export type OnUpdateUserPresenceSubscriptionVariables = Exact<{
  args: OnUpdateUserPresenceInput;
}>;


export type OnUpdateUserPresenceSubscription = { __typename?: 'Subscription', onUpdateUserPresence: { __typename?: 'UserPresence', id: string, userId: string, connected: EUserPresenceStatus, updatedAt: any } };

export type FindAllRelationsForMyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllRelationsForMyUserQuery = { __typename?: 'Query', findAllRelationsForMyUser: Array<{ __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> };

export type CreateRequestFriendMutationVariables = Exact<{
  args: CreateRequestFriendInput;
}>;


export type CreateRequestFriendMutation = { __typename?: 'Mutation', createRequestFriend: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type AcceptFriendRequestMutationVariables = Exact<{
  args: UpdateUserRelationInput;
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type RefuseFriendRequestMutationVariables = Exact<{
  args: UpdateUserRelationInput;
}>;


export type RefuseFriendRequestMutation = { __typename?: 'Mutation', refuseFriendRequest: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type RemoveFriendMutationVariables = Exact<{
  args: UpdateUserRelationInput;
}>;


export type RemoveFriendMutation = { __typename?: 'Mutation', removeFriend: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type BlockRelationMutationVariables = Exact<{
  userTargetId: Scalars['String'];
}>;


export type BlockRelationMutation = { __typename?: 'Mutation', blockRelation: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type UnblockRelationMutationVariables = Exact<{
  userTargetId: Scalars['String'];
}>;


export type UnblockRelationMutation = { __typename?: 'Mutation', unblockRelation: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any } };

export type OnUserRelationsChangedSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type OnUserRelationsChangedSubscription = { __typename?: 'Subscription', userRelationsChanged: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } } };

export type FindAllFriendsForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllFriendsForUserQuery = { __typename?: 'Query', findAllFriendsForUser: Array<{ __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, userTarget?: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } | null, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> };

export type FindAllBlockedForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllBlockedForUserQuery = { __typename?: 'Query', findAllBlockedForUser: Array<{ __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, userTarget?: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } | null, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> };

export type FindAllBlockedByForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllBlockedByForUserQuery = { __typename?: 'Query', findAllBlockedByForUser: Array<{ __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, userOwner?: { __typename?: 'UserPublic', id: string, username: string, avatarUrl?: string | null } | null, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } }> };

export type FindRelationQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type FindRelationQuery = { __typename?: 'Query', findRelation?: { __typename?: 'UserRelation', userOwnerId: string, userTargetId: string, type: EUserRealtionType, createdAt: any, updatedAt: any, friendInfos: { __typename?: 'UserPublicGameInfos', id: string, username: string, avatarUrl: string, ratio: number } } | null };

export const ChannelMessageFragmentDoc = gql`
    fragment channelMessage on ChannelMessage {
  id
  message
  channelId
  userId
  createdAt
  updatedAt
}
    `;
export const SignInLocalDocument = gql`
    mutation SignInLocal($args: SignInLocalInput!) {
  signInLocal(args: $args) {
    avatarUrl
    doubleAuth
    id
    username
  }
}
    `;

/**
 * __useSignInLocalMutation__
 *
 * To run a mutation, you first call `useSignInLocalMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSignInLocalMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSignInLocalMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useSignInLocalMutation(options: VueApolloComposable.UseMutationOptions<SignInLocalMutation, SignInLocalMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SignInLocalMutation, SignInLocalMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<SignInLocalMutation, SignInLocalMutationVariables>(SignInLocalDocument, options);
}
export type SignInLocalMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SignInLocalMutation, SignInLocalMutationVariables>;
export const SignUpLocalDocument = gql`
    mutation SignUpLocal($args: SignUpLocalInput!) {
  signUpLocal(args: $args) {
    id
    username
    avatarUrl
    doubleAuth
  }
}
    `;

/**
 * __useSignUpLocalMutation__
 *
 * To run a mutation, you first call `useSignUpLocalMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSignUpLocalMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSignUpLocalMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useSignUpLocalMutation(options: VueApolloComposable.UseMutationOptions<SignUpLocalMutation, SignUpLocalMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SignUpLocalMutation, SignUpLocalMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<SignUpLocalMutation, SignUpLocalMutationVariables>(SignUpLocalDocument, options);
}
export type SignUpLocalMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SignUpLocalMutation, SignUpLocalMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLogoutMutation();
 */
export function useLogoutMutation(options: VueApolloComposable.UseMutationOptions<LogoutMutation, LogoutMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LogoutMutation, LogoutMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}
export type LogoutMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LogoutMutation, LogoutMutationVariables>;
export const CreateChannelDocument = gql`
    mutation CreateChannel($args: CreateChannelInput!) {
  createChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useCreateChannelMutation(options: VueApolloComposable.UseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
}
export type CreateChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateChannelMutation, CreateChannelMutationVariables>;
export const UpdateChannelDocument = gql`
    mutation UpdateChannel($args: UpdateChannelInput!) {
  updateChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useUpdateChannelMutation__
 *
 * To run a mutation, you first call `useUpdateChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useUpdateChannelMutation(options: VueApolloComposable.UseMutationOptions<UpdateChannelMutation, UpdateChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateChannelMutation, UpdateChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateChannelMutation, UpdateChannelMutationVariables>(UpdateChannelDocument, options);
}
export type UpdateChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateChannelMutation, UpdateChannelMutationVariables>;
export const DeleteChannelDocument = gql`
    mutation DeleteChannel($args: DeleteChannelInput!) {
  deleteChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useDeleteChannelMutation__
 *
 * To run a mutation, you first call `useDeleteChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useDeleteChannelMutation(options: VueApolloComposable.UseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteChannelMutation, DeleteChannelMutationVariables>(DeleteChannelDocument, options);
}
export type DeleteChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const FindAllVisibleChannelsDocument = gql`
    query FindAllVisibleChannels {
  findAllVisibleChannels {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useFindAllVisibleChannelsQuery__
 *
 * To run a query within a Vue component, call `useFindAllVisibleChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllVisibleChannelsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllVisibleChannelsQuery();
 */
export function useFindAllVisibleChannelsQuery(options: VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>(FindAllVisibleChannelsDocument, {}, options);
}
export function useFindAllVisibleChannelsLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>(FindAllVisibleChannelsDocument, {}, options);
}
export type FindAllVisibleChannelsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllVisibleChannelsQuery, FindAllVisibleChannelsQueryVariables>;
export const FindAllChannelsForUserDocument = gql`
    query FindAllChannelsForUser {
  findAllChannelsForUser {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useFindAllChannelsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllChannelsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllChannelsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllChannelsForUserQuery();
 */
export function useFindAllChannelsForUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>(FindAllChannelsForUserDocument, {}, options);
}
export function useFindAllChannelsForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>(FindAllChannelsForUserDocument, {}, options);
}
export type FindAllChannelsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllChannelsForUserQuery, FindAllChannelsForUserQueryVariables>;
export const FindChannelDocument = gql`
    query FindChannel($args: FindChannelInput!) {
  findChannel(args: $args) {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useFindChannelQuery__
 *
 * To run a query within a Vue component, call `useFindChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindChannelQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindChannelQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindChannelQuery(variables: FindChannelQueryVariables | VueCompositionApi.Ref<FindChannelQueryVariables> | ReactiveFunction<FindChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindChannelQuery, FindChannelQueryVariables>(FindChannelDocument, variables, options);
}
export function useFindChannelLazyQuery(variables: FindChannelQueryVariables | VueCompositionApi.Ref<FindChannelQueryVariables> | ReactiveFunction<FindChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindChannelQuery, FindChannelQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindChannelQuery, FindChannelQueryVariables>(FindChannelDocument, variables, options);
}
export type FindChannelQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindChannelQuery, FindChannelQueryVariables>;
export const CheckChannelNameDocument = gql`
    query CheckChannelName($args: CheckChannelInput!) {
  checkChannelName(args: $args)
}
    `;

/**
 * __useCheckChannelNameQuery__
 *
 * To run a query within a Vue component, call `useCheckChannelNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckChannelNameQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useCheckChannelNameQuery({
 *   args: // value for 'args'
 * });
 */
export function useCheckChannelNameQuery(variables: CheckChannelNameQueryVariables | VueCompositionApi.Ref<CheckChannelNameQueryVariables> | ReactiveFunction<CheckChannelNameQueryVariables>, options: VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<CheckChannelNameQuery, CheckChannelNameQueryVariables>(CheckChannelNameDocument, variables, options);
}
export function useCheckChannelNameLazyQuery(variables: CheckChannelNameQueryVariables | VueCompositionApi.Ref<CheckChannelNameQueryVariables> | ReactiveFunction<CheckChannelNameQueryVariables>, options: VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CheckChannelNameQuery, CheckChannelNameQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<CheckChannelNameQuery, CheckChannelNameQueryVariables>(CheckChannelNameDocument, variables, options);
}
export type CheckChannelNameQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<CheckChannelNameQuery, CheckChannelNameQueryVariables>;
export const OnCreateChannelDocument = gql`
    subscription OnCreateChannel {
  onCreateChannel {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useOnCreateChannelSubscription__
 *
 * To run a query within a Vue component, call `useOnCreateChannelSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnCreateChannelSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnCreateChannelSubscription();
 */
export function useOnCreateChannelSubscription(options: VueApolloComposable.UseSubscriptionOptions<OnCreateChannelSubscription, OnCreateChannelSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnCreateChannelSubscription, OnCreateChannelSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnCreateChannelSubscription, OnCreateChannelSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnCreateChannelSubscription, OnCreateChannelSubscriptionVariables>(OnCreateChannelDocument, {}, options);
}
export type OnCreateChannelSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnCreateChannelSubscription, OnCreateChannelSubscriptionVariables>;
export const OnUpdateChannelDocument = gql`
    subscription OnUpdateChannel($args: OnChannelInput!) {
  onUpdateChannel(args: $args) {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useOnUpdateChannelSubscription__
 *
 * To run a query within a Vue component, call `useOnUpdateChannelSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUpdateChannelSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnUpdateChannelSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnUpdateChannelSubscription(variables: OnUpdateChannelSubscriptionVariables | VueCompositionApi.Ref<OnUpdateChannelSubscriptionVariables> | ReactiveFunction<OnUpdateChannelSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelSubscription, OnUpdateChannelSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelSubscription, OnUpdateChannelSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelSubscription, OnUpdateChannelSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnUpdateChannelSubscription, OnUpdateChannelSubscriptionVariables>(OnUpdateChannelDocument, variables, options);
}
export type OnUpdateChannelSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnUpdateChannelSubscription, OnUpdateChannelSubscriptionVariables>;
export const OnDeleteChannelDocument = gql`
    subscription OnDeleteChannel($args: OnChannelInput!) {
  onDeleteChannel(args: $args) {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useOnDeleteChannelSubscription__
 *
 * To run a query within a Vue component, call `useOnDeleteChannelSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnDeleteChannelSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnDeleteChannelSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnDeleteChannelSubscription(variables: OnDeleteChannelSubscriptionVariables | VueCompositionApi.Ref<OnDeleteChannelSubscriptionVariables> | ReactiveFunction<OnDeleteChannelSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelSubscription, OnDeleteChannelSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelSubscription, OnDeleteChannelSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelSubscription, OnDeleteChannelSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnDeleteChannelSubscription, OnDeleteChannelSubscriptionVariables>(OnDeleteChannelDocument, variables, options);
}
export type OnDeleteChannelSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnDeleteChannelSubscription, OnDeleteChannelSubscriptionVariables>;
export const SendDirectMessageDocument = gql`
    mutation SendDirectMessage($args: SendDirectMessageInput!) {
  sendDirectMessage(args: $args) {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useSendDirectMessageMutation__
 *
 * To run a mutation, you first call `useSendDirectMessageMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useSendDirectMessageMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useSendDirectMessageMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useSendDirectMessageMutation(options: VueApolloComposable.UseMutationOptions<SendDirectMessageMutation, SendDirectMessageMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<SendDirectMessageMutation, SendDirectMessageMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<SendDirectMessageMutation, SendDirectMessageMutationVariables>(SendDirectMessageDocument, options);
}
export type SendDirectMessageMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<SendDirectMessageMutation, SendDirectMessageMutationVariables>;
export const OnNewVisibleChannelDocument = gql`
    subscription OnNewVisibleChannel {
  onNewVisibleChannel {
    id
    name
    avatarUrl
    channelType
    createdAt
  }
}
    `;

/**
 * __useOnNewVisibleChannelSubscription__
 *
 * To run a query within a Vue component, call `useOnNewVisibleChannelSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewVisibleChannelSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnNewVisibleChannelSubscription();
 */
export function useOnNewVisibleChannelSubscription(options: VueApolloComposable.UseSubscriptionOptions<OnNewVisibleChannelSubscription, OnNewVisibleChannelSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnNewVisibleChannelSubscription, OnNewVisibleChannelSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnNewVisibleChannelSubscription, OnNewVisibleChannelSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnNewVisibleChannelSubscription, OnNewVisibleChannelSubscriptionVariables>(OnNewVisibleChannelDocument, {}, options);
}
export type OnNewVisibleChannelSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnNewVisibleChannelSubscription, OnNewVisibleChannelSubscriptionVariables>;
export const CreateMyMemberForChannelDocument = gql`
    mutation CreateMyMemberForChannel($args: CreateMyMemberForChannelInput!) {
  createMyMemberForChannel(args: $args) {
    channelId
    userId
  }
}
    `;

/**
 * __useCreateMyMemberForChannelMutation__
 *
 * To run a mutation, you first call `useCreateMyMemberForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateMyMemberForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateMyMemberForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useCreateMyMemberForChannelMutation(options: VueApolloComposable.UseMutationOptions<CreateMyMemberForChannelMutation, CreateMyMemberForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateMyMemberForChannelMutation, CreateMyMemberForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateMyMemberForChannelMutation, CreateMyMemberForChannelMutationVariables>(CreateMyMemberForChannelDocument, options);
}
export type CreateMyMemberForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateMyMemberForChannelMutation, CreateMyMemberForChannelMutationVariables>;
export const CreateMemberForChannelDocument = gql`
    mutation CreateMemberForChannel($args: CreateMemberForChannelInput!) {
  createMemberForChannel(args: $args) {
    channelId
    userId
  }
}
    `;

/**
 * __useCreateMemberForChannelMutation__
 *
 * To run a mutation, you first call `useCreateMemberForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemberForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateMemberForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useCreateMemberForChannelMutation(options: VueApolloComposable.UseMutationOptions<CreateMemberForChannelMutation, CreateMemberForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateMemberForChannelMutation, CreateMemberForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateMemberForChannelMutation, CreateMemberForChannelMutationVariables>(CreateMemberForChannelDocument, options);
}
export type CreateMemberForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateMemberForChannelMutation, CreateMemberForChannelMutationVariables>;
export const UpdateMemberForChannelDocument = gql`
    mutation UpdateMemberForChannel($args: UpdateMyMemberForChannelInput!) {
  updateMemberForChannel(args: $args) {
    channelId
    userId
  }
}
    `;

/**
 * __useUpdateMemberForChannelMutation__
 *
 * To run a mutation, you first call `useUpdateMemberForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateMemberForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useUpdateMemberForChannelMutation(options: VueApolloComposable.UseMutationOptions<UpdateMemberForChannelMutation, UpdateMemberForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateMemberForChannelMutation, UpdateMemberForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateMemberForChannelMutation, UpdateMemberForChannelMutationVariables>(UpdateMemberForChannelDocument, options);
}
export type UpdateMemberForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateMemberForChannelMutation, UpdateMemberForChannelMutationVariables>;
export const DeleteMemberForChannelDocument = gql`
    mutation DeleteMemberForChannel($args: DeleteMemberForChannelInput!) {
  deleteMemberForChannel(args: $args) {
    channelId
    userId
  }
}
    `;

/**
 * __useDeleteMemberForChannelMutation__
 *
 * To run a mutation, you first call `useDeleteMemberForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMemberForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteMemberForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useDeleteMemberForChannelMutation(options: VueApolloComposable.UseMutationOptions<DeleteMemberForChannelMutation, DeleteMemberForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteMemberForChannelMutation, DeleteMemberForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteMemberForChannelMutation, DeleteMemberForChannelMutationVariables>(DeleteMemberForChannelDocument, options);
}
export type DeleteMemberForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteMemberForChannelMutation, DeleteMemberForChannelMutationVariables>;
export const DeleteMyMemberForChannelDocument = gql`
    mutation DeleteMyMemberForChannel($args: DeleteMyMemberForChannelInput!) {
  deleteMyMemberForChannel(args: $args) {
    channelId
    userId
  }
}
    `;

/**
 * __useDeleteMyMemberForChannelMutation__
 *
 * To run a mutation, you first call `useDeleteMyMemberForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMyMemberForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteMyMemberForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useDeleteMyMemberForChannelMutation(options: VueApolloComposable.UseMutationOptions<DeleteMyMemberForChannelMutation, DeleteMyMemberForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteMyMemberForChannelMutation, DeleteMyMemberForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteMyMemberForChannelMutation, DeleteMyMemberForChannelMutationVariables>(DeleteMyMemberForChannelDocument, options);
}
export type DeleteMyMemberForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteMyMemberForChannelMutation, DeleteMyMemberForChannelMutationVariables>;
export const FindAllChannelMembersForChannelDocument = gql`
    query FindAllChannelMembersForChannel($args: FindAllChannelMembersForChannelInput!) {
  findAllChannelMembersForChannel(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    user {
      id
      username
      avatarUrl
    }
  }
}
    `;

/**
 * __useFindAllChannelMembersForChannelQuery__
 *
 * To run a query within a Vue component, call `useFindAllChannelMembersForChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllChannelMembersForChannelQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllChannelMembersForChannelQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindAllChannelMembersForChannelQuery(variables: FindAllChannelMembersForChannelQueryVariables | VueCompositionApi.Ref<FindAllChannelMembersForChannelQueryVariables> | ReactiveFunction<FindAllChannelMembersForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>(FindAllChannelMembersForChannelDocument, variables, options);
}
export function useFindAllChannelMembersForChannelLazyQuery(variables: FindAllChannelMembersForChannelQueryVariables | VueCompositionApi.Ref<FindAllChannelMembersForChannelQueryVariables> | ReactiveFunction<FindAllChannelMembersForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>(FindAllChannelMembersForChannelDocument, variables, options);
}
export type FindAllChannelMembersForChannelQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllChannelMembersForChannelQuery, FindAllChannelMembersForChannelQueryVariables>;
export const FindMyChannelMemberForChannelDocument = gql`
    query FindMyChannelMemberForChannel($args: FindMyChannelMemberForChannelInput!) {
  findMyChannelMemberForChannel(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useFindMyChannelMemberForChannelQuery__
 *
 * To run a query within a Vue component, call `useFindMyChannelMemberForChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMyChannelMemberForChannelQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindMyChannelMemberForChannelQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindMyChannelMemberForChannelQuery(variables: FindMyChannelMemberForChannelQueryVariables | VueCompositionApi.Ref<FindMyChannelMemberForChannelQueryVariables> | ReactiveFunction<FindMyChannelMemberForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>(FindMyChannelMemberForChannelDocument, variables, options);
}
export function useFindMyChannelMemberForChannelLazyQuery(variables: FindMyChannelMemberForChannelQueryVariables | VueCompositionApi.Ref<FindMyChannelMemberForChannelQueryVariables> | ReactiveFunction<FindMyChannelMemberForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>(FindMyChannelMemberForChannelDocument, variables, options);
}
export type FindMyChannelMemberForChannelQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindMyChannelMemberForChannelQuery, FindMyChannelMemberForChannelQueryVariables>;
export const OnNewChannelMemberForChannelIdDocument = gql`
    subscription OnNewChannelMemberForChannelId($args: OnChannelMemberChannelInput!) {
  onNewChannelMemberForChannelId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    user {
      id
      username
      avatarUrl
    }
  }
}
    `;

/**
 * __useOnNewChannelMemberForChannelIdSubscription__
 *
 * To run a query within a Vue component, call `useOnNewChannelMemberForChannelIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewChannelMemberForChannelIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnNewChannelMemberForChannelIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnNewChannelMemberForChannelIdSubscription(variables: OnNewChannelMemberForChannelIdSubscriptionVariables | VueCompositionApi.Ref<OnNewChannelMemberForChannelIdSubscriptionVariables> | ReactiveFunction<OnNewChannelMemberForChannelIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForChannelIdSubscription, OnNewChannelMemberForChannelIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForChannelIdSubscription, OnNewChannelMemberForChannelIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForChannelIdSubscription, OnNewChannelMemberForChannelIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnNewChannelMemberForChannelIdSubscription, OnNewChannelMemberForChannelIdSubscriptionVariables>(OnNewChannelMemberForChannelIdDocument, variables, options);
}
export type OnNewChannelMemberForChannelIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnNewChannelMemberForChannelIdSubscription, OnNewChannelMemberForChannelIdSubscriptionVariables>;
export const OnUpdateChannelMemberForChannelIdDocument = gql`
    subscription OnUpdateChannelMemberForChannelId($args: OnChannelMemberChannelInput!) {
  onUpdateChannelMemberForChannelId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    user {
      id
      username
      avatarUrl
    }
  }
}
    `;

/**
 * __useOnUpdateChannelMemberForChannelIdSubscription__
 *
 * To run a query within a Vue component, call `useOnUpdateChannelMemberForChannelIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUpdateChannelMemberForChannelIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnUpdateChannelMemberForChannelIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnUpdateChannelMemberForChannelIdSubscription(variables: OnUpdateChannelMemberForChannelIdSubscriptionVariables | VueCompositionApi.Ref<OnUpdateChannelMemberForChannelIdSubscriptionVariables> | ReactiveFunction<OnUpdateChannelMemberForChannelIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForChannelIdSubscription, OnUpdateChannelMemberForChannelIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForChannelIdSubscription, OnUpdateChannelMemberForChannelIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForChannelIdSubscription, OnUpdateChannelMemberForChannelIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnUpdateChannelMemberForChannelIdSubscription, OnUpdateChannelMemberForChannelIdSubscriptionVariables>(OnUpdateChannelMemberForChannelIdDocument, variables, options);
}
export type OnUpdateChannelMemberForChannelIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnUpdateChannelMemberForChannelIdSubscription, OnUpdateChannelMemberForChannelIdSubscriptionVariables>;
export const OnDeleteChannelMemberForChannelIdDocument = gql`
    subscription OnDeleteChannelMemberForChannelId($args: OnChannelMemberChannelInput!) {
  onDeleteChannelMemberForChannelId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    user {
      id
      username
      avatarUrl
    }
  }
}
    `;

/**
 * __useOnDeleteChannelMemberForChannelIdSubscription__
 *
 * To run a query within a Vue component, call `useOnDeleteChannelMemberForChannelIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnDeleteChannelMemberForChannelIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnDeleteChannelMemberForChannelIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnDeleteChannelMemberForChannelIdSubscription(variables: OnDeleteChannelMemberForChannelIdSubscriptionVariables | VueCompositionApi.Ref<OnDeleteChannelMemberForChannelIdSubscriptionVariables> | ReactiveFunction<OnDeleteChannelMemberForChannelIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForChannelIdSubscription, OnDeleteChannelMemberForChannelIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForChannelIdSubscription, OnDeleteChannelMemberForChannelIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForChannelIdSubscription, OnDeleteChannelMemberForChannelIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnDeleteChannelMemberForChannelIdSubscription, OnDeleteChannelMemberForChannelIdSubscriptionVariables>(OnDeleteChannelMemberForChannelIdDocument, variables, options);
}
export type OnDeleteChannelMemberForChannelIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnDeleteChannelMemberForChannelIdSubscription, OnDeleteChannelMemberForChannelIdSubscriptionVariables>;
export const OnNewChannelMemberForUserIdDocument = gql`
    subscription OnNewChannelMemberForUserId($args: OnChannelMemberUserInput!) {
  onNewChannelMemberForUserId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    channel {
      id
      name
      avatarUrl
      channelType
      createdAt
    }
  }
}
    `;

/**
 * __useOnNewChannelMemberForUserIdSubscription__
 *
 * To run a query within a Vue component, call `useOnNewChannelMemberForUserIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewChannelMemberForUserIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnNewChannelMemberForUserIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnNewChannelMemberForUserIdSubscription(variables: OnNewChannelMemberForUserIdSubscriptionVariables | VueCompositionApi.Ref<OnNewChannelMemberForUserIdSubscriptionVariables> | ReactiveFunction<OnNewChannelMemberForUserIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForUserIdSubscription, OnNewChannelMemberForUserIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForUserIdSubscription, OnNewChannelMemberForUserIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMemberForUserIdSubscription, OnNewChannelMemberForUserIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnNewChannelMemberForUserIdSubscription, OnNewChannelMemberForUserIdSubscriptionVariables>(OnNewChannelMemberForUserIdDocument, variables, options);
}
export type OnNewChannelMemberForUserIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnNewChannelMemberForUserIdSubscription, OnNewChannelMemberForUserIdSubscriptionVariables>;
export const OnUpdateChannelMemberForUserlIdDocument = gql`
    subscription OnUpdateChannelMemberForUserlId($args: OnChannelMemberUserInput!) {
  onUpdateChannelMemberForUserlId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    channel {
      id
      name
      avatarUrl
      channelType
      createdAt
    }
  }
}
    `;

/**
 * __useOnUpdateChannelMemberForUserlIdSubscription__
 *
 * To run a query within a Vue component, call `useOnUpdateChannelMemberForUserlIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUpdateChannelMemberForUserlIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnUpdateChannelMemberForUserlIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnUpdateChannelMemberForUserlIdSubscription(variables: OnUpdateChannelMemberForUserlIdSubscriptionVariables | VueCompositionApi.Ref<OnUpdateChannelMemberForUserlIdSubscriptionVariables> | ReactiveFunction<OnUpdateChannelMemberForUserlIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForUserlIdSubscription, OnUpdateChannelMemberForUserlIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForUserlIdSubscription, OnUpdateChannelMemberForUserlIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnUpdateChannelMemberForUserlIdSubscription, OnUpdateChannelMemberForUserlIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnUpdateChannelMemberForUserlIdSubscription, OnUpdateChannelMemberForUserlIdSubscriptionVariables>(OnUpdateChannelMemberForUserlIdDocument, variables, options);
}
export type OnUpdateChannelMemberForUserlIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnUpdateChannelMemberForUserlIdSubscription, OnUpdateChannelMemberForUserlIdSubscriptionVariables>;
export const OnDeleteChannelMemberForUserlIdDocument = gql`
    subscription OnDeleteChannelMemberForUserlId($args: OnChannelMemberUserInput!) {
  onDeleteChannelMemberForUserlId(args: $args) {
    channelId
    userId
    type
    muted
    createdAt
    updatedAt
    channel {
      id
      name
      avatarUrl
      channelType
      createdAt
    }
  }
}
    `;

/**
 * __useOnDeleteChannelMemberForUserlIdSubscription__
 *
 * To run a query within a Vue component, call `useOnDeleteChannelMemberForUserlIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnDeleteChannelMemberForUserlIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnDeleteChannelMemberForUserlIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnDeleteChannelMemberForUserlIdSubscription(variables: OnDeleteChannelMemberForUserlIdSubscriptionVariables | VueCompositionApi.Ref<OnDeleteChannelMemberForUserlIdSubscriptionVariables> | ReactiveFunction<OnDeleteChannelMemberForUserlIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForUserlIdSubscription, OnDeleteChannelMemberForUserlIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForUserlIdSubscription, OnDeleteChannelMemberForUserlIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMemberForUserlIdSubscription, OnDeleteChannelMemberForUserlIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnDeleteChannelMemberForUserlIdSubscription, OnDeleteChannelMemberForUserlIdSubscriptionVariables>(OnDeleteChannelMemberForUserlIdDocument, variables, options);
}
export type OnDeleteChannelMemberForUserlIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnDeleteChannelMemberForUserlIdSubscription, OnDeleteChannelMemberForUserlIdSubscriptionVariables>;
export const CreateMessageForChannelDocument = gql`
    mutation CreateMessageForChannel($args: CreateMessageForChannelInput!) {
  createMessageForChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useCreateMessageForChannelMutation__
 *
 * To run a mutation, you first call `useCreateMessageForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateMessageForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useCreateMessageForChannelMutation(options: VueApolloComposable.UseMutationOptions<CreateMessageForChannelMutation, CreateMessageForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateMessageForChannelMutation, CreateMessageForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateMessageForChannelMutation, CreateMessageForChannelMutationVariables>(CreateMessageForChannelDocument, options);
}
export type CreateMessageForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateMessageForChannelMutation, CreateMessageForChannelMutationVariables>;
export const DeleteMyMessageForChannelDocument = gql`
    mutation DeleteMyMessageForChannel($args: DeleteMyMessageForChannelInput!) {
  deleteMyMessageForChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useDeleteMyMessageForChannelMutation__
 *
 * To run a mutation, you first call `useDeleteMyMessageForChannelMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMyMessageForChannelMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteMyMessageForChannelMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useDeleteMyMessageForChannelMutation(options: VueApolloComposable.UseMutationOptions<DeleteMyMessageForChannelMutation, DeleteMyMessageForChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteMyMessageForChannelMutation, DeleteMyMessageForChannelMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteMyMessageForChannelMutation, DeleteMyMessageForChannelMutationVariables>(DeleteMyMessageForChannelDocument, options);
}
export type DeleteMyMessageForChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteMyMessageForChannelMutation, DeleteMyMessageForChannelMutationVariables>;
export const FindAllChannelMessagesForChannelDocument = gql`
    query FindAllChannelMessagesForChannel($args: FindAllMessagesForChannelInput!) {
  findAllChannelMessagesForChannel(args: $args) {
    ...channelMessage
  }
}
    ${ChannelMessageFragmentDoc}`;

/**
 * __useFindAllChannelMessagesForChannelQuery__
 *
 * To run a query within a Vue component, call `useFindAllChannelMessagesForChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllChannelMessagesForChannelQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllChannelMessagesForChannelQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindAllChannelMessagesForChannelQuery(variables: FindAllChannelMessagesForChannelQueryVariables | VueCompositionApi.Ref<FindAllChannelMessagesForChannelQueryVariables> | ReactiveFunction<FindAllChannelMessagesForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>(FindAllChannelMessagesForChannelDocument, variables, options);
}
export function useFindAllChannelMessagesForChannelLazyQuery(variables: FindAllChannelMessagesForChannelQueryVariables | VueCompositionApi.Ref<FindAllChannelMessagesForChannelQueryVariables> | ReactiveFunction<FindAllChannelMessagesForChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>(FindAllChannelMessagesForChannelDocument, variables, options);
}
export type FindAllChannelMessagesForChannelQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllChannelMessagesForChannelQuery, FindAllChannelMessagesForChannelQueryVariables>;
export const FindUserForChannelMessageDocument = gql`
    query FindUserForChannelMessage($args: FindUserForChannelMessageInput!) {
  findUserForChannelMessage(args: $args) {
    id
    username
    avatarUrl
  }
}
    `;

/**
 * __useFindUserForChannelMessageQuery__
 *
 * To run a query within a Vue component, call `useFindUserForChannelMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserForChannelMessageQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindUserForChannelMessageQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindUserForChannelMessageQuery(variables: FindUserForChannelMessageQueryVariables | VueCompositionApi.Ref<FindUserForChannelMessageQueryVariables> | ReactiveFunction<FindUserForChannelMessageQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>(FindUserForChannelMessageDocument, variables, options);
}
export function useFindUserForChannelMessageLazyQuery(variables: FindUserForChannelMessageQueryVariables | VueCompositionApi.Ref<FindUserForChannelMessageQueryVariables> | ReactiveFunction<FindUserForChannelMessageQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>(FindUserForChannelMessageDocument, variables, options);
}
export type FindUserForChannelMessageQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindUserForChannelMessageQuery, FindUserForChannelMessageQueryVariables>;
export const OnNewChannelMessageForChannelIdDocument = gql`
    subscription OnNewChannelMessageForChannelId($args: OnNewChannelMessageForChannelIdInput!) {
  onNewChannelMessageForChannelId(args: $args) {
    ...channelMessage
  }
}
    ${ChannelMessageFragmentDoc}`;

/**
 * __useOnNewChannelMessageForChannelIdSubscription__
 *
 * To run a query within a Vue component, call `useOnNewChannelMessageForChannelIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewChannelMessageForChannelIdSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnNewChannelMessageForChannelIdSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnNewChannelMessageForChannelIdSubscription(variables: OnNewChannelMessageForChannelIdSubscriptionVariables | VueCompositionApi.Ref<OnNewChannelMessageForChannelIdSubscriptionVariables> | ReactiveFunction<OnNewChannelMessageForChannelIdSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnNewChannelMessageForChannelIdSubscription, OnNewChannelMessageForChannelIdSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMessageForChannelIdSubscription, OnNewChannelMessageForChannelIdSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnNewChannelMessageForChannelIdSubscription, OnNewChannelMessageForChannelIdSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnNewChannelMessageForChannelIdSubscription, OnNewChannelMessageForChannelIdSubscriptionVariables>(OnNewChannelMessageForChannelIdDocument, variables, options);
}
export type OnNewChannelMessageForChannelIdSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnNewChannelMessageForChannelIdSubscription, OnNewChannelMessageForChannelIdSubscriptionVariables>;
export const OnDeleteChannelMessageForChannelDocument = gql`
    subscription OnDeleteChannelMessageForChannel($args: OnDeleteChannelMessageForChannel!) {
  onDeleteChannelMessageForChannel(args: $args) {
    id
  }
}
    `;

/**
 * __useOnDeleteChannelMessageForChannelSubscription__
 *
 * To run a query within a Vue component, call `useOnDeleteChannelMessageForChannelSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnDeleteChannelMessageForChannelSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnDeleteChannelMessageForChannelSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnDeleteChannelMessageForChannelSubscription(variables: OnDeleteChannelMessageForChannelSubscriptionVariables | VueCompositionApi.Ref<OnDeleteChannelMessageForChannelSubscriptionVariables> | ReactiveFunction<OnDeleteChannelMessageForChannelSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMessageForChannelSubscription, OnDeleteChannelMessageForChannelSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMessageForChannelSubscription, OnDeleteChannelMessageForChannelSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnDeleteChannelMessageForChannelSubscription, OnDeleteChannelMessageForChannelSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnDeleteChannelMessageForChannelSubscription, OnDeleteChannelMessageForChannelSubscriptionVariables>(OnDeleteChannelMessageForChannelDocument, variables, options);
}
export type OnDeleteChannelMessageForChannelSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnDeleteChannelMessageForChannelSubscription, OnDeleteChannelMessageForChannelSubscriptionVariables>;
export const AllGamesUpdatedDocument = gql`
    subscription AllGamesUpdated {
  allGamesUpdated {
    id
    message
    isDeleted
    createdAt
    targetUserId
    gameMembers {
      gameId
      userId
      score
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useAllGamesUpdatedSubscription__
 *
 * To run a query within a Vue component, call `useAllGamesUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAllGamesUpdatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useAllGamesUpdatedSubscription();
 */
export function useAllGamesUpdatedSubscription(options: VueApolloComposable.UseSubscriptionOptions<AllGamesUpdatedSubscription, AllGamesUpdatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<AllGamesUpdatedSubscription, AllGamesUpdatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<AllGamesUpdatedSubscription, AllGamesUpdatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<AllGamesUpdatedSubscription, AllGamesUpdatedSubscriptionVariables>(AllGamesUpdatedDocument, {}, options);
}
export type AllGamesUpdatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<AllGamesUpdatedSubscription, AllGamesUpdatedSubscriptionVariables>;
export const FindAllGamesDocument = gql`
    query FindAllGames {
  findAllGames {
    id
    message
    isDeleted
    createdAt
    targetUserId
    gameMembers {
      gameId
      userId
      score
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useFindAllGamesQuery__
 *
 * To run a query within a Vue component, call `useFindAllGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllGamesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllGamesQuery();
 */
export function useFindAllGamesQuery(options: VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllGamesQuery, FindAllGamesQueryVariables>(FindAllGamesDocument, {}, options);
}
export function useFindAllGamesLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGamesQuery, FindAllGamesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllGamesQuery, FindAllGamesQueryVariables>(FindAllGamesDocument, {}, options);
}
export type FindAllGamesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllGamesQuery, FindAllGamesQueryVariables>;
export const CreateGameDocument = gql`
    mutation CreateGame($message: String, $userTargetId: String) {
  createGame(message: $message, userTargetId: $userTargetId) {
    id
    message
    isDeleted
    createdAt
    targetUserId
    gameMembers {
      gameId
      userId
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateGameMutation({
 *   variables: {
 *     message: // value for 'message'
 *     userTargetId: // value for 'userTargetId'
 *   },
 * });
 */
export function useCreateGameMutation(options: VueApolloComposable.UseMutationOptions<CreateGameMutation, CreateGameMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateGameMutation, CreateGameMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
}
export type CreateGameMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateGameMutation, CreateGameMutationVariables>;
export const LeaveGameDocument = gql`
    mutation LeaveGame {
  leaveGame
}
    `;

/**
 * __useLeaveGameMutation__
 *
 * To run a mutation, you first call `useLeaveGameMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGameMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLeaveGameMutation();
 */
export function useLeaveGameMutation(options: VueApolloComposable.UseMutationOptions<LeaveGameMutation, LeaveGameMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LeaveGameMutation, LeaveGameMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LeaveGameMutation, LeaveGameMutationVariables>(LeaveGameDocument, options);
}
export type LeaveGameMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LeaveGameMutation, LeaveGameMutationVariables>;
export const FindPublicGameInfosForUserDocument = gql`
    query FindPublicGameInfosForUser($userId: String!) {
  findPublicGameInfosForUser(userid: $userId) {
    id
    username
    avatarUrl
    ratio
  }
}
    `;

/**
 * __useFindPublicGameInfosForUserQuery__
 *
 * To run a query within a Vue component, call `useFindPublicGameInfosForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPublicGameInfosForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindPublicGameInfosForUserQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useFindPublicGameInfosForUserQuery(variables: FindPublicGameInfosForUserQueryVariables | VueCompositionApi.Ref<FindPublicGameInfosForUserQueryVariables> | ReactiveFunction<FindPublicGameInfosForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>(FindPublicGameInfosForUserDocument, variables, options);
}
export function useFindPublicGameInfosForUserLazyQuery(variables: FindPublicGameInfosForUserQueryVariables | VueCompositionApi.Ref<FindPublicGameInfosForUserQueryVariables> | ReactiveFunction<FindPublicGameInfosForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>(FindPublicGameInfosForUserDocument, variables, options);
}
export type FindPublicGameInfosForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindPublicGameInfosForUserQuery, FindPublicGameInfosForUserQueryVariables>;
export const LeaveGameMatchmakingMemberDocument = gql`
    mutation LeaveGameMatchmakingMember {
  leaveGameMatchmakingMember {
    userId
    message
  }
}
    `;

/**
 * __useLeaveGameMatchmakingMemberMutation__
 *
 * To run a mutation, you first call `useLeaveGameMatchmakingMemberMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGameMatchmakingMemberMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLeaveGameMatchmakingMemberMutation();
 */
export function useLeaveGameMatchmakingMemberMutation(options: VueApolloComposable.UseMutationOptions<LeaveGameMatchmakingMemberMutation, LeaveGameMatchmakingMemberMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LeaveGameMatchmakingMemberMutation, LeaveGameMatchmakingMemberMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LeaveGameMatchmakingMemberMutation, LeaveGameMatchmakingMemberMutationVariables>(LeaveGameMatchmakingMemberDocument, options);
}
export type LeaveGameMatchmakingMemberMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LeaveGameMatchmakingMemberMutation, LeaveGameMatchmakingMemberMutationVariables>;
export const JoinGameMatchmakingMemberDocument = gql`
    mutation JoinGameMatchmakingMember($message: String, $userTargetId: String) {
  joinGameMatchmakingMember(message: $message, userTargetId: $userTargetId) {
    userId
    message
    isDeleted
    targetUserId
    userGameInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useJoinGameMatchmakingMemberMutation__
 *
 * To run a mutation, you first call `useJoinGameMatchmakingMemberMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMatchmakingMemberMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useJoinGameMatchmakingMemberMutation({
 *   variables: {
 *     message: // value for 'message'
 *     userTargetId: // value for 'userTargetId'
 *   },
 * });
 */
export function useJoinGameMatchmakingMemberMutation(options: VueApolloComposable.UseMutationOptions<JoinGameMatchmakingMemberMutation, JoinGameMatchmakingMemberMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<JoinGameMatchmakingMemberMutation, JoinGameMatchmakingMemberMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<JoinGameMatchmakingMemberMutation, JoinGameMatchmakingMemberMutationVariables>(JoinGameMatchmakingMemberDocument, options);
}
export type JoinGameMatchmakingMemberMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<JoinGameMatchmakingMemberMutation, JoinGameMatchmakingMemberMutationVariables>;
export const DeleteGameDocument = gql`
    mutation DeleteGame($gameId: String!) {
  deleteGame(args: {id: $gameId}) {
    id
    message
    isDeleted
    targetUserId
    createdAt
  }
}
    `;

/**
 * __useDeleteGameMutation__
 *
 * To run a mutation, you first call `useDeleteGameMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGameMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteGameMutation({
 *   variables: {
 *     gameId: // value for 'gameId'
 *   },
 * });
 */
export function useDeleteGameMutation(options: VueApolloComposable.UseMutationOptions<DeleteGameMutation, DeleteGameMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteGameMutation, DeleteGameMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteGameMutation, DeleteGameMutationVariables>(DeleteGameDocument, options);
}
export type DeleteGameMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteGameMutation, DeleteGameMutationVariables>;
export const JoinGameDocument = gql`
    mutation joinGame($gameId: String!) {
  joinGame(args: {id: $gameId}) {
    message
    isDeleted
    targetUserId
    createdAt
    gameMembers {
      gameId
      userId
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useJoinGameMutation__
 *
 * To run a mutation, you first call `useJoinGameMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useJoinGameMutation({
 *   variables: {
 *     gameId: // value for 'gameId'
 *   },
 * });
 */
export function useJoinGameMutation(options: VueApolloComposable.UseMutationOptions<JoinGameMutation, JoinGameMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<JoinGameMutation, JoinGameMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, options);
}
export type JoinGameMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<JoinGameMutation, JoinGameMutationVariables>;
export const MatchmakingMembersChangedDocument = gql`
    subscription MatchmakingMembersChanged {
  matchmakingMembersChanged {
    userId
    isDeleted
    targetUserId
    isLaunched
    userGameInfos {
      id
      username
      avatarUrl
      ratio
    }
    message
  }
}
    `;

/**
 * __useMatchmakingMembersChangedSubscription__
 *
 * To run a query within a Vue component, call `useMatchmakingMembersChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMatchmakingMembersChangedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useMatchmakingMembersChangedSubscription();
 */
export function useMatchmakingMembersChangedSubscription(options: VueApolloComposable.UseSubscriptionOptions<MatchmakingMembersChangedSubscription, MatchmakingMembersChangedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<MatchmakingMembersChangedSubscription, MatchmakingMembersChangedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<MatchmakingMembersChangedSubscription, MatchmakingMembersChangedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<MatchmakingMembersChangedSubscription, MatchmakingMembersChangedSubscriptionVariables>(MatchmakingMembersChangedDocument, {}, options);
}
export type MatchmakingMembersChangedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<MatchmakingMembersChangedSubscription, MatchmakingMembersChangedSubscriptionVariables>;
export const UserGameUpdatedDocument = gql`
    subscription UserGameUpdated($userId: String!) {
  UserGameUpdated(userId: $userId) {
    id
    message
    isDeleted
    targetUserId
    createdAt
    gameMembers {
      gameId
      userId
      score
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useUserGameUpdatedSubscription__
 *
 * To run a query within a Vue component, call `useUserGameUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserGameUpdatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useUserGameUpdatedSubscription({
 *   userId: // value for 'userId'
 * });
 */
export function useUserGameUpdatedSubscription(variables: UserGameUpdatedSubscriptionVariables | VueCompositionApi.Ref<UserGameUpdatedSubscriptionVariables> | ReactiveFunction<UserGameUpdatedSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<UserGameUpdatedSubscription, UserGameUpdatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<UserGameUpdatedSubscription, UserGameUpdatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<UserGameUpdatedSubscription, UserGameUpdatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<UserGameUpdatedSubscription, UserGameUpdatedSubscriptionVariables>(UserGameUpdatedDocument, variables, options);
}
export type UserGameUpdatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<UserGameUpdatedSubscription, UserGameUpdatedSubscriptionVariables>;
export const GetUserGameBeforeStartDocument = gql`
    query GetUserGameBeforeStart {
  getUserGameBeforeStart {
    id
    message
    isDeleted
    targetUserId
    createdAt
    gameMembers {
      gameId
      userId
      score
      userGameInfos {
        id
        username
        avatarUrl
        ratio
      }
    }
  }
}
    `;

/**
 * __useGetUserGameBeforeStartQuery__
 *
 * To run a query within a Vue component, call `useGetUserGameBeforeStartQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserGameBeforeStartQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetUserGameBeforeStartQuery();
 */
export function useGetUserGameBeforeStartQuery(options: VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>(GetUserGameBeforeStartDocument, {}, options);
}
export function useGetUserGameBeforeStartLazyQuery(options: VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>(GetUserGameBeforeStartDocument, {}, options);
}
export type GetUserGameBeforeStartQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetUserGameBeforeStartQuery, GetUserGameBeforeStartQueryVariables>;
export const FindAllGameMatchmakingMemberlDocument = gql`
    query FindAllGameMatchmakingMemberl {
  findAllGameMatchmakingMemberl {
    userId
    isDeleted
    targetUserId
    isLaunched
    userGameInfos {
      id
      username
      avatarUrl
      ratio
    }
    message
  }
}
    `;

/**
 * __useFindAllGameMatchmakingMemberlQuery__
 *
 * To run a query within a Vue component, call `useFindAllGameMatchmakingMemberlQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllGameMatchmakingMemberlQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllGameMatchmakingMemberlQuery();
 */
export function useFindAllGameMatchmakingMemberlQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>(FindAllGameMatchmakingMemberlDocument, {}, options);
}
export function useFindAllGameMatchmakingMemberlLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>(FindAllGameMatchmakingMemberlDocument, {}, options);
}
export type FindAllGameMatchmakingMemberlQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllGameMatchmakingMemberlQuery, FindAllGameMatchmakingMemberlQueryVariables>;
export const RefusePrivateGameInvitationDocument = gql`
    mutation RefusePrivateGameInvitation($gameId: String!) {
  refusePrivateGameInvitation(gameId: $gameId)
}
    `;

/**
 * __useRefusePrivateGameInvitationMutation__
 *
 * To run a mutation, you first call `useRefusePrivateGameInvitationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRefusePrivateGameInvitationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRefusePrivateGameInvitationMutation({
 *   variables: {
 *     gameId: // value for 'gameId'
 *   },
 * });
 */
export function useRefusePrivateGameInvitationMutation(options: VueApolloComposable.UseMutationOptions<RefusePrivateGameInvitationMutation, RefusePrivateGameInvitationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RefusePrivateGameInvitationMutation, RefusePrivateGameInvitationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RefusePrivateGameInvitationMutation, RefusePrivateGameInvitationMutationVariables>(RefusePrivateGameInvitationDocument, options);
}
export type RefusePrivateGameInvitationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RefusePrivateGameInvitationMutation, RefusePrivateGameInvitationMutationVariables>;
export const RefuseMatchMakingInviteDocument = gql`
    mutation RefuseMatchMakingInvite($matchMakerId: String!) {
  refuseMatchMakingInvite(matchMakerId: $matchMakerId) {
    userId
    message
    isDeleted
    targetUserId
  }
}
    `;

/**
 * __useRefuseMatchMakingInviteMutation__
 *
 * To run a mutation, you first call `useRefuseMatchMakingInviteMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRefuseMatchMakingInviteMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRefuseMatchMakingInviteMutation({
 *   variables: {
 *     matchMakerId: // value for 'matchMakerId'
 *   },
 * });
 */
export function useRefuseMatchMakingInviteMutation(options: VueApolloComposable.UseMutationOptions<RefuseMatchMakingInviteMutation, RefuseMatchMakingInviteMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RefuseMatchMakingInviteMutation, RefuseMatchMakingInviteMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RefuseMatchMakingInviteMutation, RefuseMatchMakingInviteMutationVariables>(RefuseMatchMakingInviteDocument, options);
}
export type RefuseMatchMakingInviteMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RefuseMatchMakingInviteMutation, RefuseMatchMakingInviteMutationVariables>;
export const AllGamesStatsUpdatedDocument = gql`
    subscription allGamesStatsUpdated {
  allGamesStatsUpdated {
    id
    opponentId
    isWinner
    userScore
    opponentScore
    createdAt
    isDeleted
  }
}
    `;

/**
 * __useAllGamesStatsUpdatedSubscription__
 *
 * To run a query within a Vue component, call `useAllGamesStatsUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAllGamesStatsUpdatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useAllGamesStatsUpdatedSubscription();
 */
export function useAllGamesStatsUpdatedSubscription(options: VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedSubscription, AllGamesStatsUpdatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedSubscription, AllGamesStatsUpdatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedSubscription, AllGamesStatsUpdatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<AllGamesStatsUpdatedSubscription, AllGamesStatsUpdatedSubscriptionVariables>(AllGamesStatsUpdatedDocument, {}, options);
}
export type AllGamesStatsUpdatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<AllGamesStatsUpdatedSubscription, AllGamesStatsUpdatedSubscriptionVariables>;
export const AllGamesStatsUpdatedForUserDocument = gql`
    subscription allGamesStatsUpdatedForUser($userId: String!) {
  allGamesStatsUpdatedForUser(userId: $userId) {
    id
    opponentId
    userId
    isWinner
    userScore
    opponentScore
    createdAt
    isDeleted
  }
}
    `;

/**
 * __useAllGamesStatsUpdatedForUserSubscription__
 *
 * To run a query within a Vue component, call `useAllGamesStatsUpdatedForUserSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAllGamesStatsUpdatedForUserSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useAllGamesStatsUpdatedForUserSubscription({
 *   userId: // value for 'userId'
 * });
 */
export function useAllGamesStatsUpdatedForUserSubscription(variables: AllGamesStatsUpdatedForUserSubscriptionVariables | VueCompositionApi.Ref<AllGamesStatsUpdatedForUserSubscriptionVariables> | ReactiveFunction<AllGamesStatsUpdatedForUserSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedForUserSubscription, AllGamesStatsUpdatedForUserSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedForUserSubscription, AllGamesStatsUpdatedForUserSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<AllGamesStatsUpdatedForUserSubscription, AllGamesStatsUpdatedForUserSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<AllGamesStatsUpdatedForUserSubscription, AllGamesStatsUpdatedForUserSubscriptionVariables>(AllGamesStatsUpdatedForUserDocument, variables, options);
}
export type AllGamesStatsUpdatedForUserSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<AllGamesStatsUpdatedForUserSubscription, AllGamesStatsUpdatedForUserSubscriptionVariables>;
export const FindAllGameStatsSoftLimitDocument = gql`
    query FindAllGameStatsSoftLimit {
  findAllGameStatsSoftLimit {
    id
    userId
    opponentId
    isWinner
    userScore
    opponentScore
    createdAt
    isDeleted
  }
}
    `;

/**
 * __useFindAllGameStatsSoftLimitQuery__
 *
 * To run a query within a Vue component, call `useFindAllGameStatsSoftLimitQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllGameStatsSoftLimitQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllGameStatsSoftLimitQuery();
 */
export function useFindAllGameStatsSoftLimitQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>(FindAllGameStatsSoftLimitDocument, {}, options);
}
export function useFindAllGameStatsSoftLimitLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>(FindAllGameStatsSoftLimitDocument, {}, options);
}
export type FindAllGameStatsSoftLimitQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllGameStatsSoftLimitQuery, FindAllGameStatsSoftLimitQueryVariables>;
export const FindLeaderboardUserListDocument = gql`
    query FindLeaderboardUserList {
  findLeaderboardUserList {
    id
    username
    avatarUrl
    ratio
    winrate
  }
}
    `;

/**
 * __useFindLeaderboardUserListQuery__
 *
 * To run a query within a Vue component, call `useFindLeaderboardUserListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindLeaderboardUserListQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindLeaderboardUserListQuery();
 */
export function useFindLeaderboardUserListQuery(options: VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>(FindLeaderboardUserListDocument, {}, options);
}
export function useFindLeaderboardUserListLazyQuery(options: VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>(FindLeaderboardUserListDocument, {}, options);
}
export type FindLeaderboardUserListQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindLeaderboardUserListQuery, FindLeaderboardUserListQueryVariables>;
export const FindMyUserDocument = gql`
    query FindMyUser {
  findMyUser {
    id
    doubleAuth
    avatarUrl
    username
    isOauth
  }
}
    `;

/**
 * __useFindMyUserQuery__
 *
 * To run a query within a Vue component, call `useFindMyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMyUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindMyUserQuery();
 */
export function useFindMyUserQuery(options: VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindMyUserQuery, FindMyUserQueryVariables>(FindMyUserDocument, {}, options);
}
export function useFindMyUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindMyUserQuery, FindMyUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindMyUserQuery, FindMyUserQueryVariables>(FindMyUserDocument, {}, options);
}
export type FindMyUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindMyUserQuery, FindMyUserQueryVariables>;
export const FindUserTwoFaSettingsDocument = gql`
    query FindUserTwoFaSettings {
  findUserTwoFaSettings {
    googleAuthenticatorQrCode
  }
}
    `;

/**
 * __useFindUserTwoFaSettingsQuery__
 *
 * To run a query within a Vue component, call `useFindUserTwoFaSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserTwoFaSettingsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindUserTwoFaSettingsQuery();
 */
export function useFindUserTwoFaSettingsQuery(options: VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>(FindUserTwoFaSettingsDocument, {}, options);
}
export function useFindUserTwoFaSettingsLazyQuery(options: VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>(FindUserTwoFaSettingsDocument, {}, options);
}
export type FindUserTwoFaSettingsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindUserTwoFaSettingsQuery, FindUserTwoFaSettingsQueryVariables>;
export const UpdateMyUserDocument = gql`
    mutation UpdateMyUser($args: UpdateMyUserInput!) {
  updateMyUser(args: $args) {
    id
    doubleAuth
    avatarUrl
    username
    isOauth
  }
}
    `;

/**
 * __useUpdateMyUserMutation__
 *
 * To run a mutation, you first call `useUpdateMyUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateMyUserMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useUpdateMyUserMutation(options: VueApolloComposable.UseMutationOptions<UpdateMyUserMutation, UpdateMyUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateMyUserMutation, UpdateMyUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateMyUserMutation, UpdateMyUserMutationVariables>(UpdateMyUserDocument, options);
}
export type UpdateMyUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateMyUserMutation, UpdateMyUserMutationVariables>;
export const UpdateMyPasswordDocument = gql`
    mutation UpdateMyPassword($args: UpdateMyPasswordInput!) {
  updateMyPassword(args: $args)
}
    `;

/**
 * __useUpdateMyPasswordMutation__
 *
 * To run a mutation, you first call `useUpdateMyPasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyPasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateMyPasswordMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useUpdateMyPasswordMutation(options: VueApolloComposable.UseMutationOptions<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>(UpdateMyPasswordDocument, options);
}
export type UpdateMyPasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateMyPasswordMutation, UpdateMyPasswordMutationVariables>;
export const IsGoogleAuthCodeValidDocument = gql`
    mutation IsGoogleAuthCodeValid($args: GoogleAuthCodeValidatorInput!) {
  isGoogleAuthCodeValid(args: $args)
}
    `;

/**
 * __useIsGoogleAuthCodeValidMutation__
 *
 * To run a mutation, you first call `useIsGoogleAuthCodeValidMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useIsGoogleAuthCodeValidMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useIsGoogleAuthCodeValidMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useIsGoogleAuthCodeValidMutation(options: VueApolloComposable.UseMutationOptions<IsGoogleAuthCodeValidMutation, IsGoogleAuthCodeValidMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<IsGoogleAuthCodeValidMutation, IsGoogleAuthCodeValidMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<IsGoogleAuthCodeValidMutation, IsGoogleAuthCodeValidMutationVariables>(IsGoogleAuthCodeValidDocument, options);
}
export type IsGoogleAuthCodeValidMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<IsGoogleAuthCodeValidMutation, IsGoogleAuthCodeValidMutationVariables>;
export const FindPublicGameRatiosDocument = gql`
    query FindPublicGameRatios($userid: String!) {
  findPublicGameRatios(userid: $userid) {
    date
    ratio
  }
}
    `;

/**
 * __useFindPublicGameRatiosQuery__
 *
 * To run a query within a Vue component, call `useFindPublicGameRatiosQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPublicGameRatiosQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindPublicGameRatiosQuery({
 *   userid: // value for 'userid'
 * });
 */
export function useFindPublicGameRatiosQuery(variables: FindPublicGameRatiosQueryVariables | VueCompositionApi.Ref<FindPublicGameRatiosQueryVariables> | ReactiveFunction<FindPublicGameRatiosQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>(FindPublicGameRatiosDocument, variables, options);
}
export function useFindPublicGameRatiosLazyQuery(variables: FindPublicGameRatiosQueryVariables | VueCompositionApi.Ref<FindPublicGameRatiosQueryVariables> | ReactiveFunction<FindPublicGameRatiosQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>(FindPublicGameRatiosDocument, variables, options);
}
export type FindPublicGameRatiosQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindPublicGameRatiosQuery, FindPublicGameRatiosQueryVariables>;
export const FindGeneralGameStatsForUserDocument = gql`
    query findGeneralGameStatsForUser {
  findGeneralGameStatsForUser {
    gamesCount
    allTimeRatio
    MeanPoints
    leaderBoardPosition
  }
}
    `;

/**
 * __useFindGeneralGameStatsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindGeneralGameStatsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindGeneralGameStatsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindGeneralGameStatsForUserQuery();
 */
export function useFindGeneralGameStatsForUserQuery(options: VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>(FindGeneralGameStatsForUserDocument, {}, options);
}
export function useFindGeneralGameStatsForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>(FindGeneralGameStatsForUserDocument, {}, options);
}
export type FindGeneralGameStatsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindGeneralGameStatsForUserQuery, FindGeneralGameStatsForUserQueryVariables>;
export const FindAllGameStatsForUserDocument = gql`
    query FindAllGameStatsForUser {
  findAllGameStatsForUser {
    id
    opponentId
    isWinner
    userScore
    opponentScore
    createdAt
  }
}
    `;

/**
 * __useFindAllGameStatsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllGameStatsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllGameStatsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllGameStatsForUserQuery();
 */
export function useFindAllGameStatsForUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>(FindAllGameStatsForUserDocument, {}, options);
}
export function useFindAllGameStatsForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>(FindAllGameStatsForUserDocument, {}, options);
}
export type FindAllGameStatsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllGameStatsForUserQuery, FindAllGameStatsForUserQueryVariables>;
export const FindPublicGeneralGameStatsForUserDocument = gql`
    query findPublicGeneralGameStatsForUser($userid: String!) {
  findPublicGeneralGameStatsForUser(userid: $userid) {
    gamesCount
    allTimeRatio
    MeanPoints
    leaderBoardPosition
  }
}
    `;

/**
 * __useFindPublicGeneralGameStatsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindPublicGeneralGameStatsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPublicGeneralGameStatsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindPublicGeneralGameStatsForUserQuery({
 *   userid: // value for 'userid'
 * });
 */
export function useFindPublicGeneralGameStatsForUserQuery(variables: FindPublicGeneralGameStatsForUserQueryVariables | VueCompositionApi.Ref<FindPublicGeneralGameStatsForUserQueryVariables> | ReactiveFunction<FindPublicGeneralGameStatsForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>(FindPublicGeneralGameStatsForUserDocument, variables, options);
}
export function useFindPublicGeneralGameStatsForUserLazyQuery(variables: FindPublicGeneralGameStatsForUserQueryVariables | VueCompositionApi.Ref<FindPublicGeneralGameStatsForUserQueryVariables> | ReactiveFunction<FindPublicGeneralGameStatsForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>(FindPublicGeneralGameStatsForUserDocument, variables, options);
}
export type FindPublicGeneralGameStatsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindPublicGeneralGameStatsForUserQuery, FindPublicGeneralGameStatsForUserQueryVariables>;
export const FindAllPublicGameStatsForUserDocument = gql`
    query FindAllPublicGameStatsForUser($userid: String!) {
  findAllPublicGameStatsForUser(userid: $userid) {
    id
    opponentId
    isWinner
    userScore
    opponentScore
    createdAt
  }
}
    `;

/**
 * __useFindAllPublicGameStatsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllPublicGameStatsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPublicGameStatsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllPublicGameStatsForUserQuery({
 *   userid: // value for 'userid'
 * });
 */
export function useFindAllPublicGameStatsForUserQuery(variables: FindAllPublicGameStatsForUserQueryVariables | VueCompositionApi.Ref<FindAllPublicGameStatsForUserQueryVariables> | ReactiveFunction<FindAllPublicGameStatsForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>(FindAllPublicGameStatsForUserDocument, variables, options);
}
export function useFindAllPublicGameStatsForUserLazyQuery(variables: FindAllPublicGameStatsForUserQueryVariables | VueCompositionApi.Ref<FindAllPublicGameStatsForUserQueryVariables> | ReactiveFunction<FindAllPublicGameStatsForUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>(FindAllPublicGameStatsForUserDocument, variables, options);
}
export type FindAllPublicGameStatsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllPublicGameStatsForUserQuery, FindAllPublicGameStatsForUserQueryVariables>;
export const FindUserDocument = gql`
    query FindUser($args: FindUserInput!) {
  findUser(args: $args) {
    id
    username
    avatarUrl
  }
}
    `;

/**
 * __useFindUserQuery__
 *
 * To run a query within a Vue component, call `useFindUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindUserQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindUserQuery(variables: FindUserQueryVariables | VueCompositionApi.Ref<FindUserQueryVariables> | ReactiveFunction<FindUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, variables, options);
}
export function useFindUserLazyQuery(variables: FindUserQueryVariables | VueCompositionApi.Ref<FindUserQueryVariables> | ReactiveFunction<FindUserQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserQuery, FindUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, variables, options);
}
export type FindUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindUserQuery, FindUserQueryVariables>;
export const FindPublicUsersListDocument = gql`
    query FindPublicUsersList {
  findPublicUsersList {
    id
    username
    avatarUrl
  }
}
    `;

/**
 * __useFindPublicUsersListQuery__
 *
 * To run a query within a Vue component, call `useFindPublicUsersListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPublicUsersListQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindPublicUsersListQuery();
 */
export function useFindPublicUsersListQuery(options: VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>(FindPublicUsersListDocument, {}, options);
}
export function useFindPublicUsersListLazyQuery(options: VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>(FindPublicUsersListDocument, {}, options);
}
export type FindPublicUsersListQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindPublicUsersListQuery, FindPublicUsersListQueryVariables>;
export const FindUserPresenceDocument = gql`
    query FindUserPresence($args: FindUserPresencesInput!) {
  findUserPresence(args: $args) {
    id
    userId
    connected
    updatedAt
  }
}
    `;

/**
 * __useFindUserPresenceQuery__
 *
 * To run a query within a Vue component, call `useFindUserPresenceQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserPresenceQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindUserPresenceQuery({
 *   args: // value for 'args'
 * });
 */
export function useFindUserPresenceQuery(variables: FindUserPresenceQueryVariables | VueCompositionApi.Ref<FindUserPresenceQueryVariables> | ReactiveFunction<FindUserPresenceQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindUserPresenceQuery, FindUserPresenceQueryVariables>(FindUserPresenceDocument, variables, options);
}
export function useFindUserPresenceLazyQuery(variables: FindUserPresenceQueryVariables | VueCompositionApi.Ref<FindUserPresenceQueryVariables> | ReactiveFunction<FindUserPresenceQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindUserPresenceQuery, FindUserPresenceQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindUserPresenceQuery, FindUserPresenceQueryVariables>(FindUserPresenceDocument, variables, options);
}
export type FindUserPresenceQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindUserPresenceQuery, FindUserPresenceQueryVariables>;
export const UpdateUserPresenceDocument = gql`
    mutation UpdateUserPresence($args: UpdateUserPresenceInput!) {
  updateUserPresence(args: $args) {
    id
    userId
    connected
    updatedAt
  }
}
    `;

/**
 * __useUpdateUserPresenceMutation__
 *
 * To run a mutation, you first call `useUpdateUserPresenceMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPresenceMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateUserPresenceMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useUpdateUserPresenceMutation(options: VueApolloComposable.UseMutationOptions<UpdateUserPresenceMutation, UpdateUserPresenceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateUserPresenceMutation, UpdateUserPresenceMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateUserPresenceMutation, UpdateUserPresenceMutationVariables>(UpdateUserPresenceDocument, options);
}
export type UpdateUserPresenceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateUserPresenceMutation, UpdateUserPresenceMutationVariables>;
export const OnUpdateUserPresenceDocument = gql`
    subscription OnUpdateUserPresence($args: OnUpdateUserPresenceInput!) {
  onUpdateUserPresence(args: $args) {
    id
    userId
    connected
    updatedAt
  }
}
    `;

/**
 * __useOnUpdateUserPresenceSubscription__
 *
 * To run a query within a Vue component, call `useOnUpdateUserPresenceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUpdateUserPresenceSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnUpdateUserPresenceSubscription({
 *   args: // value for 'args'
 * });
 */
export function useOnUpdateUserPresenceSubscription(variables: OnUpdateUserPresenceSubscriptionVariables | VueCompositionApi.Ref<OnUpdateUserPresenceSubscriptionVariables> | ReactiveFunction<OnUpdateUserPresenceSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnUpdateUserPresenceSubscription, OnUpdateUserPresenceSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnUpdateUserPresenceSubscription, OnUpdateUserPresenceSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnUpdateUserPresenceSubscription, OnUpdateUserPresenceSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnUpdateUserPresenceSubscription, OnUpdateUserPresenceSubscriptionVariables>(OnUpdateUserPresenceDocument, variables, options);
}
export type OnUpdateUserPresenceSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnUpdateUserPresenceSubscription, OnUpdateUserPresenceSubscriptionVariables>;
export const FindAllRelationsForMyUserDocument = gql`
    query FindAllRelationsForMyUser {
  findAllRelationsForMyUser {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useFindAllRelationsForMyUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllRelationsForMyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllRelationsForMyUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllRelationsForMyUserQuery();
 */
export function useFindAllRelationsForMyUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>(FindAllRelationsForMyUserDocument, {}, options);
}
export function useFindAllRelationsForMyUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>(FindAllRelationsForMyUserDocument, {}, options);
}
export type FindAllRelationsForMyUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllRelationsForMyUserQuery, FindAllRelationsForMyUserQueryVariables>;
export const CreateRequestFriendDocument = gql`
    mutation CreateRequestFriend($args: CreateRequestFriendInput!) {
  createRequestFriend(args: $args) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreateRequestFriendMutation__
 *
 * To run a mutation, you first call `useCreateRequestFriendMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestFriendMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateRequestFriendMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useCreateRequestFriendMutation(options: VueApolloComposable.UseMutationOptions<CreateRequestFriendMutation, CreateRequestFriendMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateRequestFriendMutation, CreateRequestFriendMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateRequestFriendMutation, CreateRequestFriendMutationVariables>(CreateRequestFriendDocument, options);
}
export type CreateRequestFriendMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateRequestFriendMutation, CreateRequestFriendMutationVariables>;
export const AcceptFriendRequestDocument = gql`
    mutation AcceptFriendRequest($args: UpdateUserRelationInput!) {
  acceptFriendRequest(args: $args) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useAcceptFriendRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFriendRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAcceptFriendRequestMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useAcceptFriendRequestMutation(options: VueApolloComposable.UseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument, options);
}
export type AcceptFriendRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;
export const RefuseFriendRequestDocument = gql`
    mutation RefuseFriendRequest($args: UpdateUserRelationInput!) {
  refuseFriendRequest(args: $args) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useRefuseFriendRequestMutation__
 *
 * To run a mutation, you first call `useRefuseFriendRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRefuseFriendRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRefuseFriendRequestMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useRefuseFriendRequestMutation(options: VueApolloComposable.UseMutationOptions<RefuseFriendRequestMutation, RefuseFriendRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RefuseFriendRequestMutation, RefuseFriendRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RefuseFriendRequestMutation, RefuseFriendRequestMutationVariables>(RefuseFriendRequestDocument, options);
}
export type RefuseFriendRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RefuseFriendRequestMutation, RefuseFriendRequestMutationVariables>;
export const RemoveFriendDocument = gql`
    mutation RemoveFriend($args: UpdateUserRelationInput!) {
  removeFriend(args: $args) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useRemoveFriendMutation__
 *
 * To run a mutation, you first call `useRemoveFriendMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFriendMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRemoveFriendMutation({
 *   variables: {
 *     args: // value for 'args'
 *   },
 * });
 */
export function useRemoveFriendMutation(options: VueApolloComposable.UseMutationOptions<RemoveFriendMutation, RemoveFriendMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveFriendMutation, RemoveFriendMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RemoveFriendMutation, RemoveFriendMutationVariables>(RemoveFriendDocument, options);
}
export type RemoveFriendMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveFriendMutation, RemoveFriendMutationVariables>;
export const BlockRelationDocument = gql`
    mutation BlockRelation($userTargetId: String!) {
  blockRelation(args: {userTargetid: $userTargetId}) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useBlockRelationMutation__
 *
 * To run a mutation, you first call `useBlockRelationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useBlockRelationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useBlockRelationMutation({
 *   variables: {
 *     userTargetId: // value for 'userTargetId'
 *   },
 * });
 */
export function useBlockRelationMutation(options: VueApolloComposable.UseMutationOptions<BlockRelationMutation, BlockRelationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<BlockRelationMutation, BlockRelationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<BlockRelationMutation, BlockRelationMutationVariables>(BlockRelationDocument, options);
}
export type BlockRelationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<BlockRelationMutation, BlockRelationMutationVariables>;
export const UnblockRelationDocument = gql`
    mutation UnblockRelation($userTargetId: String!) {
  unblockRelation(args: {userTargetid: $userTargetId}) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUnblockRelationMutation__
 *
 * To run a mutation, you first call `useUnblockRelationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUnblockRelationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUnblockRelationMutation({
 *   variables: {
 *     userTargetId: // value for 'userTargetId'
 *   },
 * });
 */
export function useUnblockRelationMutation(options: VueApolloComposable.UseMutationOptions<UnblockRelationMutation, UnblockRelationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UnblockRelationMutation, UnblockRelationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UnblockRelationMutation, UnblockRelationMutationVariables>(UnblockRelationDocument, options);
}
export type UnblockRelationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UnblockRelationMutation, UnblockRelationMutationVariables>;
export const OnUserRelationsChangedDocument = gql`
    subscription onUserRelationsChanged($userId: String!) {
  userRelationsChanged(userId: $userId) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useOnUserRelationsChangedSubscription__
 *
 * To run a query within a Vue component, call `useOnUserRelationsChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUserRelationsChangedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useOnUserRelationsChangedSubscription({
 *   userId: // value for 'userId'
 * });
 */
export function useOnUserRelationsChangedSubscription(variables: OnUserRelationsChangedSubscriptionVariables | VueCompositionApi.Ref<OnUserRelationsChangedSubscriptionVariables> | ReactiveFunction<OnUserRelationsChangedSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<OnUserRelationsChangedSubscription, OnUserRelationsChangedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<OnUserRelationsChangedSubscription, OnUserRelationsChangedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<OnUserRelationsChangedSubscription, OnUserRelationsChangedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<OnUserRelationsChangedSubscription, OnUserRelationsChangedSubscriptionVariables>(OnUserRelationsChangedDocument, variables, options);
}
export type OnUserRelationsChangedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<OnUserRelationsChangedSubscription, OnUserRelationsChangedSubscriptionVariables>;
export const FindAllFriendsForUserDocument = gql`
    query FindAllFriendsForUser {
  findAllFriendsForUser {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    userTarget {
      id
      username
      avatarUrl
    }
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useFindAllFriendsForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllFriendsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllFriendsForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllFriendsForUserQuery();
 */
export function useFindAllFriendsForUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>(FindAllFriendsForUserDocument, {}, options);
}
export function useFindAllFriendsForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>(FindAllFriendsForUserDocument, {}, options);
}
export type FindAllFriendsForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllFriendsForUserQuery, FindAllFriendsForUserQueryVariables>;
export const FindAllBlockedForUserDocument = gql`
    query FindAllBlockedForUser {
  findAllBlockedForUser {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    userTarget {
      id
      username
      avatarUrl
    }
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useFindAllBlockedForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllBlockedForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllBlockedForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllBlockedForUserQuery();
 */
export function useFindAllBlockedForUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>(FindAllBlockedForUserDocument, {}, options);
}
export function useFindAllBlockedForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>(FindAllBlockedForUserDocument, {}, options);
}
export type FindAllBlockedForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllBlockedForUserQuery, FindAllBlockedForUserQueryVariables>;
export const FindAllBlockedByForUserDocument = gql`
    query FindAllBlockedByForUser {
  findAllBlockedByForUser {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    userOwner {
      id
      username
      avatarUrl
    }
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useFindAllBlockedByForUserQuery__
 *
 * To run a query within a Vue component, call `useFindAllBlockedByForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllBlockedByForUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindAllBlockedByForUserQuery();
 */
export function useFindAllBlockedByForUserQuery(options: VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>(FindAllBlockedByForUserDocument, {}, options);
}
export function useFindAllBlockedByForUserLazyQuery(options: VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>(FindAllBlockedByForUserDocument, {}, options);
}
export type FindAllBlockedByForUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindAllBlockedByForUserQuery, FindAllBlockedByForUserQueryVariables>;
export const FindRelationDocument = gql`
    query FindRelation($userId: String!) {
  findRelation(userId: $userId) {
    userOwnerId
    userTargetId
    type
    createdAt
    updatedAt
    friendInfos {
      id
      username
      avatarUrl
      ratio
    }
  }
}
    `;

/**
 * __useFindRelationQuery__
 *
 * To run a query within a Vue component, call `useFindRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindRelationQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useFindRelationQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useFindRelationQuery(variables: FindRelationQueryVariables | VueCompositionApi.Ref<FindRelationQueryVariables> | ReactiveFunction<FindRelationQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<FindRelationQuery, FindRelationQueryVariables>(FindRelationDocument, variables, options);
}
export function useFindRelationLazyQuery(variables: FindRelationQueryVariables | VueCompositionApi.Ref<FindRelationQueryVariables> | ReactiveFunction<FindRelationQueryVariables>, options: VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<FindRelationQuery, FindRelationQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<FindRelationQuery, FindRelationQueryVariables>(FindRelationDocument, variables, options);
}
export type FindRelationQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<FindRelationQuery, FindRelationQueryVariables>;