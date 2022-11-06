import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnParameter, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class GrowakWebSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stageName = new CfnParameter(this, "stageName", {
      type: 'String',
      description: 'The stage name'
    });
 
    const bucket = new s3.Bucket(this, `Bucket`, {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.UNENCRYPTED,
      enforceSSL: false,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    
    const distribution = new cf.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        
      },
    });

    const deployment = new deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [deploy.Source.asset('src')],
      destinationBucket: bucket,
      distribution: distribution,
    });

  }
}
