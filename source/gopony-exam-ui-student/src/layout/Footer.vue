<template>
	<!-- 页面底部 -->
	<div class="footer" style="visibility: visible; height: 80px;">
		<p class="friendly-links">©<span class="my-footer-year">Copyright©2020-2022 </span> 小马考试通<br><a href="https://www.gopony.cn" class="my-footer-year" target="_blank">www.gopony.cn</a></p>
		
		
	</div>
</template>

<script>
	export default {
		name: 'Footer',
		data() {
			return {
				linkList: []
			}
		},

	}
</script>

<style scoped>
	.footer {
		background-color: #5b5755;
		padding: 32px 0;
		margin: 0 auto;
		min-width: 1200px;
		margin-top: 32px;
	}

	.footer p {
		text-align: center;
		color: #ffffff;
	}

	.footer p a:hover {
		text-decoration: underline;
	}

	.footer .friendly-links a {
		color: #ef6723;
	}

	.footer .credentials a {
		color: #ffffff;
	}

	.footer .certificate {
		padding-left: 40%;
	}
</style>
