<template>
  <div>
    <Row class="expand-row">
      <Col span="4">
        <span class="expand-key">校名：</span>
        <span class="expand-value">{{ row.schoolName }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">年级：</span>
        <span class="expand-value">{{ row.grade }}</span>
      </Col>
      <Col span="4">
        <span class="expand-key">班级：</span>
        <span class="expand-value">{{ row.clazz }}</span>
      </Col>
      <Col span="12">
        <span class="expand-key">任教信息：</span>
        <span class="expand-value">{{ row.subject }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    name: 'ExpandRow',
    props: {
      row: Object
    }
  };
</script>
<style scoped lang="less">
  .expand-row {
    color: #333333;

    .expand-key {
      margin-right: 8px;
    }

    .expand-value {

    }
  }
</style>
