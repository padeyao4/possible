<template>
    <div class="parent">
        <div class="test">hello world</div>
    </div>
</template>

<script setup>


</script>
<style>
.parent {
    background-color: rgb(0, 58, 39);
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.test {
    /* absolute定位是相对于找到最近的祖先元素包含position的元素 */
    position: absolute;
    border: 1px solid;
    left: 0;
    color: wheat;
}
</style>