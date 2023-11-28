<template>
    <div class="user-item-container">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <el-image style="width: 56px; height: 100%;  border-radius: 100%; margin-right: 2%;"
                :src="props.user.avatarUrl"></el-image>
            <div class="user-description">
                <div class="user-name">
                    {{ user.username }}
                </div>
            </div>
        </div>
        <el-button size="large" @click="onAddMember(user)" type="info" plain><el-icon>
                <User />
            </el-icon><el-icon>
                <Plus />
            </el-icon></el-button>
    </div>
</template>
  
<script setup lang="ts">

import type { UserPublic, UserPublicGameInfos } from '@/graphql/graphql-operations'

const props = defineProps<{
    user: UserPublicGameInfos,
    onAddMember(user: UserPublicGameInfos): any,
}>()


</script>
  
<style scoped lang="sass">
.user-item-container
    padding: 10px
    height: 42px
    display: flex
    align-items: center
    justify-content: space-between
    margin: 10px
    border-radius: var(--el-border-radius-base)
    &:hover
        background-image: linear-gradient(315deg, hsl(320deg 88% 71%) 1%, hsl(329deg 100% 72%) 43%, hsl(336deg 100% 72%) 50%, hsl(345deg 100% 72%) 51%, hsl(356deg 100% 73%) 51%, hsl(7deg 100% 72%) 49%, hsl(18deg 100% 68%) 49%, hsl(26deg 100% 64%) 50%, hsl(33deg 100% 61%) 57%, hsl(39deg 97% 57%) 99%)
        
.user-description
    display: flex
    flex-direction: column
  
.user-name
    font-weight: bold
    font-size: large
  </style>