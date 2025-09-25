import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { SupervisorsModule } from './supervisors/supervisors.module';
import { CandidatesModule } from './candidates/candidates.module';
import { RepositoryModule } from './repository/repository.module';
import { PlagiarismModule } from './plagiarism/plagiarism.module';
import { GradingModule } from './grading/grading.module';
import { DefenceModule } from './defence/defence.module';
import { PaymentsModule } from './payments/payments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RateLimitMiddleware } from './security/rate-limit.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    RolesModule,
    AuthModule,
    AuditModule,
    SupervisorsModule,
    CandidatesModule,
    RepositoryModule,
    PlagiarismModule,
    GradingModule,
    DefenceModule,
    PaymentsModule,
    CertificatesModule,
    AnalyticsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule{}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
