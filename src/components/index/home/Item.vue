<template>
  <div class="content">
    <slot name="title"></slot>
    <Row style="margin-top: 16px;" type="flex" justify="space-between">
      <Col span="12" class="col">
      <Row type="flex" align="middle" justify="space-between">
        <Col span="4" style="text-align: center">
        <slot name="col0"></slot>
        </Col>
        <Col span="19" >
        <slot name="col1"></slot>
        </Col>
      </Row>
      </Col>
      <Col span="11" class="height">
      <Row type="flex" align="middle" justify="space-between">
        <Col span="4" style="text-align: center">
        <slot name="col2"></slot>
        </Col>
        <Col span="19">
        <slot name="col3"></slot>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    name: 'Item',
    data() {
      return {}
    }
  }
</script>
<style scoped lang="less">
  .content {
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 16px 0px 16px 16px;
    margin-bottom: 32px;
  }

  .height {
    height: 115px;
    padding-right: 16px;
  }

  .col {
    border-right: 1px solid lightgray;
    .height;
  }
</style>
