<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-left">
                <p>&copy; 2025 ArtReader. All rights reserved.</p>
            </div>
            <div class="footer-center">
                <p>Follow us:</p>
                <ul class="social-links">
                    <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
                    <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
                    <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
                </ul>
            </div>
            <div class="footer-right">
                <p>Contact us: <a href="mailto:contact@yourcompany.com">contact@yourcompany.com</a></p>
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
export default {
    name: "AppFooter",
};
</script>

<style scoped>
.footer {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
    position: relative;
    bottom: 0;
    width: 100%;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.footer-left,
.footer-center,
.footer-right {
    flex: 1;
    padding: 10px;
}

.social-links {
    list-style: none;
    padding: 0;
}

.social-links li {
    display: inline-block;
    margin-right: 10px;
}

.social-links a {
    color: #fff;
    text-decoration: none;
}

.social-links a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    .footer-left,
    .footer-center,
    .footer-right {
        flex: 100%;
        margin-bottom: 10px;
    }
}
</style>