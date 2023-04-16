<template>
    <b-avatar
        :src="user.photoUrl"
        :text="text"
        :alt="alt"
        :size="size"
    ></b-avatar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ProfileInterface } from '@/api/profile'

@Component
export default class ProfileAvatar extends Vue {
    @Prop({
        required: true,
    })
    user!: ProfileInterface

    @Prop()
    size!: string

    get alt(): string {
        return `${this.user.name} ${this.user.lastName}`
    }

    get text(): string {
        let tag = ''

        if (this.user.name !== '') {
            tag += this.user.name[0]
        }

        if (this.user.lastName !== '') {
            tag += this.user.lastName[0]
        }

        return tag
    }
}
</script>
